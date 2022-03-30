export interface IProps {
  placeholder: string;
  maxLength?: number;
  // eslint-disable-next-line no-unused-vars
  onChange?: (val: string) => void; // 返回值没有类型，即返回值为空
  value?: string;
  style?: Object;
  disabled?: boolean;
  trim?: boolean;
}

export interface KeyWordListType {
  keyWord?: string;
  type?: string | number;
}

export interface ContentListType {
  id?: number;
  msgType?: string;
  content?: string;
  imgUrl?: string;
  uid?: string;
  title?: string;
  text?: RulesPropsText;
  attachmentId?: number | string;
}

export interface DetailContextType {
  businessType?: number;
  gmtCreate?: string | null;
  gmtModified?: string | null;
  id?: number;
  keyWordList: object[] | undefined;
  messageList: object[] | undefined;
  name?: string;
  replyTimesLimit?: number;
  status?: number;
  tenantId?: number;
  tiktokUserId?: number;
}

export interface RulesPropsType {
  id?: number;
  image?: RulesPropsImage;
  msgType?: string | number;
  text?: RulesPropsText;
}

export interface RulesPropsImage {
  title?: string;
  attachmentId?: number;
  attachmentPath?: string;
}

export interface RulesPropsText {
  content?: string;
}
