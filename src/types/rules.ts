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
