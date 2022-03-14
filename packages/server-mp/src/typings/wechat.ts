export interface MessageStrategies {
  buildMessage(message: Message): Promise<string>;
}

export enum MessageTypeEnum {
  Video = 'video',
  ShortVide = 'shortvideo',
  Location = 'location',
  Link = 'link',
  Event = 'event',
  Voice = 'voice',
  Image = 'image',
  Text = 'text',
}

export enum EventTypeEnum {
  Subscribe = 'subscribe',
  UnSubscribe = 'unsubscribe',
  Scan = 'SCAN',
  Location = 'LOCATION',
  Click = 'CLICK',
  View = 'VIEW',
}

export interface StandardMessage {
  /** 开发者微信号 */
  ToUserName: string,
  /** 发送方帐号（一个OpenID） */
  FromUserName: string,
  /** 消息创建时间 （整型） */
  CreateTime: number,
  /* 消息id */
  MsgId: number,
}

export interface StandardEventMessage {
  /** 开发者微信号 */
  ToUserName: string,
  /** 发送方帐号（一个OpenID） */
  FromUserName: string,
  /** 消息创建时间 （整型） */
  CreateTime: number,
  /** 消息类型，event */
  MsgType: 'event',
}

export interface TextMessage extends StandardMessage {
  /** 消息类型，文本为text */
  MsgType: 'text',
  /** 文本消息内容 */
  Content: string,
}

export interface ImageMessage extends StandardMessage {
  /** 消息类型，图片为image */
  MsgType: 'image',
  /** 图片链接（由系统生成） */
  PicUrl: string,
  /** 图片消息媒体id，可以调用获取临时素材接口拉取数据。 */
  MediaId: number,
}

export interface VoiceMessage extends StandardMessage {
  /** 语音为voice */
  MsgType: 'voice',
  /** 语音消息媒体id，可以调用获取临时素材接口拉取数据 */
  MediaId: string,
  /** 语音格式，如amr，speex等 */
  Format: string,
  /** 语音识别结果，UTF8编码 */
  Recognition?: string,
}

export interface VideoMessage extends StandardMessage {
  /** 语音为voice */
  MsgType: 'video',
  /** 语音消息媒体id，可以调用获取临时素材接口拉取数据 */
  MediaId: string,
  /** 语音格式，如amr，speex等 */
  ThumbMediaId: string,
}

export interface ShortVideoMessage extends StandardMessage {
  /** 小视频为shortvideo */
  MsgType: 'shortvideo',
  /** 语音消息媒体id，可以调用获取临时素材接口拉取数据 */
  MediaId: string,
  /** 语音格式，如amr，speex等 */
  ThumbMediaId: string,
}


export interface LocationMessage extends StandardMessage {
  /** 消息类型，地理位置为location */
  MsgType: 'location',
  /** 地理位置纬度 */
  Location_X: string,
  /** 地理位置经度 */
  Location_Y: string,
  /** 地图缩放大小 */
  Scale: string,
  /** 地理位置信息 */
  Label: string,
}

export interface LinkMessage extends StandardMessage {
  /** 消息类型，链接为link */
  MsgType: 'link',
  /** 消息标题 */
  Title: string,
  /** 消息描述 */
  Description: string,
  /** 消息链接 */
  Url: string,
}

export interface SubscribeEvent extends StandardEventMessage {
  Event: 'subscribe',
  /** 事件KEY值，qrscene_为前缀，后面为二维码的参数值 */
  EventKey?: string,
  /** 二维码的ticket，可用来换取二维码图片  */
  Ticket?: string,
}

export interface UnsubscribeEvent extends StandardEventMessage {
  Event: 'unsubscribe',
}

export interface ScanEvent extends StandardEventMessage {
  Event: 'SCAN',
  /** 事件KEY值，是一个32位无符号整数，即创建二维码时的二维码scene_id */
  EventKey?: string,
  /** 二维码的ticket，可用来换取二维码图片  */
  Ticket?: string,
}

export interface LocationEvent extends StandardEventMessage {
  Event: 'LOCATION',
  /** 地理位置纬度 */
  Latitude: string,
  /** 地理位置经度 */
  Longitude: string,
  /** 地理位置精度 */
  Precision: string,
}

/** 点击菜单拉取消息时的事件推送 */
export interface ClickEvent extends StandardEventMessage {
  /** 事件类型，CLICK */
  Event: 'CLICK'
  /** 事件KEY值，与自定义菜单接口中 KEY 值对应 */
  EventKey: string,
}

/** 点击菜单跳转链接时的事件推送 */
export interface ViewEvent extends StandardEventMessage {
  /** 事件类型，VIEW */
  Event: 'VIEW'
  /** 事件KEY值，设置的跳转URL */
  EventKey: string,
}

export type Message = TextMessage
  | ImageMessage
  | VoiceMessage
  | VideoMessage
  | ShortVideoMessage
  | LocationMessage
  | LinkMessage
  | SubscribeEvent
  | UnsubscribeEvent
  | ScanEvent
  | LocationEvent
  | ClickEvent
  | ViewEvent;

