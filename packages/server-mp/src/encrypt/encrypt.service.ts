import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const ALGORITHM = 'aes-256-cbc'     // 使用的加密算法
const MSG_LENGTH_SIZE = 4           // 存放消息体尺寸的空间大小。单位：字节
const RANDOM_BYTES_SIZE = 16        // 随机数据的大小。单位：字节
const BLOCK_SIZE = 32               // 分块尺寸。单位：字节

@Injectable()
export class EncryptService {
  private readonly appId: string;
  private readonly token: string;
  /** 解码密钥 */
  private readonly key: Buffer;
  /** 初始化向量为密钥的前16字节 */
  private readonly iv: Buffer;

  constructor(
    private readonly config: ConfigService
  ) {
    const appId = this.config.get('MP_APPID');
    const token = this.config.get('MP_TOKEN');
    const encodingAESKey = this.config.get('MP_ENCODING_AES_KEY');

    const key = Buffer.from(encodingAESKey + '=', 'base64');
    const iv = key.slice(0, 16);

    this.appId = appId;
    this.token = token;
    this.key = key;
    this.iv = iv;
  }

  /**
   * 加密消息
   * @param {string} msg 待加密的消息体
   */
  encode = (msg: string) => {
    const { appId, key, iv } = this;
    // 生成指定大小的随机数据
    const randomBytes = crypto.randomBytes(RANDOM_BYTES_SIZE);
    // 申请指定大小的空间，存放消息体的大小
    const msgLenBuf = Buffer.alloc(MSG_LENGTH_SIZE);
    // 写入的偏移值
    const offset = 0;
    // 按大端序（网络字节序）写入消息体的大小
    msgLenBuf.writeUInt32BE(Buffer.byteLength(msg), offset);
    // 将消息体转成 buffer
    let msgBuf = Buffer.from(msg);
    // 将 APPID 转成 buffer                                               
    let appIdBuf = Buffer.from(appId);
    // 将16字节的随机数据、4字节的消息体大小、若干字节的消息体、若干字节的APPID拼接起来
    let totalBuf = Buffer.concat([randomBytes, msgLenBuf, msgBuf, appIdBuf]);
    // 创建加密器实例
    let cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    // 禁用默认的数据填充方式
    cipher.setAutoPadding(false);
    // 使用自定义的数据填充方式
    totalBuf = this.PKCS7Encode(totalBuf);
    // 加密后的数据
    const encryptedBuf = Buffer.concat([cipher.update(totalBuf), cipher.final()]);
    // 返回加密数据的 base64 编码结果
    return encryptedBuf.toString('base64');
  }

  /**
   * 解密消息
   * @param {string} encryptedMsg 待解密的消息体
   */
  decode = (encryptedMsg: string) => {
    const { key, iv } = this
    // 将 base64 编码的数据转成 buffer
    const encryptedMsgBuf = Buffer.from(encryptedMsg, 'base64');
    // 创建解密器实例
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    // 禁用默认的数据填充方式
    decipher.setAutoPadding(false);
    // 解密后的数据
    let decryptedBuf = Buffer.concat([decipher.update(encryptedMsgBuf), decipher.final()]);
    // 去除填充的数据
    decryptedBuf = this.PKCS7Decode(decryptedBuf);
    // 根据指定偏移值，从 buffer 中读取消息体的大小，单位：字节
    const msgSize = decryptedBuf.readUInt32BE(RANDOM_BYTES_SIZE);
    // 消息体的起始位置
    const msgBufStartPos = RANDOM_BYTES_SIZE + MSG_LENGTH_SIZE;
    // 消息体的结束位置
    const msgBufEndPos = msgBufStartPos + msgSize;
    // 从 buffer 中提取消息体
    const msgBuf = decryptedBuf.slice(msgBufStartPos, msgBufEndPos);
    // 将消息体转成字符串，并返回数据
    return msgBuf.toString();
  }

  /**
   * 生成签名
   * @param {Object} params 待签名的参数
   */
  genSign = (params: {
    timestamp: string,
    nonce: string,
    encrypt: string,
  }) => {
    const { token } = this;
    const { timestamp, nonce, encrypt } = params;
    // 原始字符串
    const rawStr = [token, timestamp, nonce, encrypt].sort().join('');
    // 计算签名
    return crypto.createHash('sha1').update(rawStr).digest('hex');
  }

  /**
   * 按 PKCS#7 的方式从填充过的数据中提取原数据
   * @param {Buffer} buf 待处理的数据
   */
  PKCS7Decode = (buf: Buffer) => {
    // 最后1字节记录着填充的数据大小
    const padSize = buf[buf.length - 1];
    // 提取原数据
    return buf.slice(0, buf.length - padSize);
  }

  /**
   * 按 PKCS#7 的方式填充数据结尾
   * @param {Buffer} buf 待填充的数据
   */
  PKCS7Encode = (buf: Buffer) => {
    // 计算填充的大小。
    const padSize = BLOCK_SIZE - (buf.length % BLOCK_SIZE);
    // 填充的字节数据为填充的大小
    const fillByte = padSize;
    // 分配指定大小的空间，并填充数据
    const padBuf = Buffer.alloc(padSize, fillByte);
    // 拼接原数据和填充的数据
    return Buffer.concat([buf, padBuf]);
  }
}
