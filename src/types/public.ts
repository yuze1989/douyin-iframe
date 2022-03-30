export interface IObjectKeys {
  [key: string]: any;
}

// 数据上传
export interface OssDataType extends IObjectKeys {
  accessKeyId?: string;
  OSSAccessKeyId?: string;
  policy?: string;
  signature?: string;
  dir?: string;
  host?: string;
  callback?: string;
}
