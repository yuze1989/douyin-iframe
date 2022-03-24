import { message } from 'antd';
import { RcFile } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { OssDataType } from 'types/public';
import http from './http';

export const useCloudUpload = (
  businessType: string,
  callback?: (value: any, index?: number) => void,
) => {
  const [ossData, setOssData] = useState<OssDataType>();
  const [loading, setLoading] = useState(false);
  const getOssData = () => {
    http.post('/social/oss-upload/get-upload-policy', {
      businessType,
    }).then((res) => {
      const { data, success } = res;
      if (success) {
        setOssData(data);
      }
    });
  };
  const getExtraData = (file: UploadFile<any>) => {
    const [name, suffix] = file.name.split('.');
    return {
      key: `${ossData?.dir}${name}-${moment().valueOf()}.${suffix}` || '',
      OSSAccessKeyId: ossData?.accessKeyId || '',
      policy: ossData?.policy || '',
      Signature: ossData?.signature || '',
      callback: ossData?.callback || '',
    };
  };
  const uploadFile = async (fileList: RcFile[]) => {
    setLoading(true);
    fileList.forEach((file: RcFile, i) => {
      const formData: FormData = new FormData();
      const [name, suffix] = file.name.split('.');
      formData.append('key', `${ossData?.dir}${name}-${moment().valueOf()}.${suffix}` || '');
      formData.append('OSSAccessKeyId', ossData?.accessKeyId || '');
      formData.append('policy', ossData?.policy || '');
      formData.append('Signature', ossData?.signature || '');
      formData.append('callback', ossData?.callback || '');
      // file文件必须在最后
      formData.append('file', file);
      if (ossData?.host) {
        http.post(ossData?.host, formData).then(({ data, success, errMessage }) => {
          if (i === fileList.length - 1) {
            setLoading(false);
          }
          if (!success) {
            message.error(errMessage);
            return;
          }
          const uploadOrderType = {
            originalFileName: file.name,
            ossPath: data.filename,
            fileSize: data.size,
          };
          callback?.(uploadOrderType, i);
        }).catch(() => {
          message.error('接口超时，请刷新后重试');
        });
      }
    });
  };
  const uploadAttachment = async (
    fileName: string,
    fileType?: string,
    filePath?: string,
    fileSize?: number,
    status?: number,
  ) => {
    const { data, success } = await http.post('/social/attachment/add-attachment', {
      fileName,
      fileType,
      filePath,
      fileSize,
      status,
    });
    if (!success) {
      message.warning('上传失败，请重新上传');
    }
    return success ? data : null;
  };
  useEffect(() => {
    getOssData();
  }, []);
  return {
    loading,
    ossData,
    uploadFile,
    getExtraData,
    uploadAttachment,
  };
};

export const useVideoImg = () => {};
