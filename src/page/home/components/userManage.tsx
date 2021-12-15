import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import touch from 'assets/touch.png';
import reply from 'assets/reply.png';
import moment from 'moment';
import dayjs from 'dayjs';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Table,
  Pagination,
  TablePaginationConfig,
  InputNumber,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import http from 'utils/http';
import {
  TableItem, TableDataType, MarketStatistics, ParmasType,
} from 'types/home';

const { Option } = Select;
interface Props {
  openId: string;
}
const UserManage = (props: Props) => {
  const { openId } = props;
  const [form] = Form.useForm();
  const [searchType, setSearchType] = useState<string>('nickname');
  const [marketStatistics, setMarketStatistics] = useState<MarketStatistics>({});
  const [tableData, setTableData] = useState<TableDataType>();
  const { RangePicker } = DatePicker;
  const defaultSelectDate = {
    startDate: moment().startOf('day').subtract(1, 'month'),
    endDate: moment().endOf('day'),
  };
  const onFinish = () => {
    getTiktokList();
  };
  const getTiktokList = (parmas?: ParmasType) => {
    const value = form.getFieldsValue();
    if (value.lastReachedTime) {
      const [startTime, endTime] = value.lastReachedTime;
      value.lastReachedTimeGE = dayjs(startTime).format('YYYY/MM/DD');
      value.lastReachedTimeLE = dayjs(endTime).format('YYYY/MM/DD');
    }
    value.openId = openId;
    delete value.lastReachedTime;
    http.get('/service-market/list-reach-record', { ...value, ...parmas }).then((res) => {
      const { success } = res;
      if (success) {
        setTableData(res);
      }
    });
  };
  const reset = () => {
    form.resetFields();
    getTiktokList();
  };
  const pageChange = (pagination: TablePaginationConfig) => {
    const page = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
      openId,
    };
    getTiktokList(page);
  };
  const getStatistics = () => {
    http.get('/service-market/statistics', { openId }).then((res) => {
      const { success, data } = res;
      if (success) {
        setMarketStatistics(data);
      }
    });
  };
  useEffect(() => {
    getStatistics();
    getTiktokList();
  }, []);

  const columns: ColumnsType<TableItem> = [
    {
      title: '用户信息',
      width: 280,
      key: 'nickname',
      dataIndex: 'nickname',
      fixed: 'left',
      align: 'center',
      render: (text, record) => (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <MyAvatar>
              <img src={record.avatar} alt="" />
            </MyAvatar>
            <div>{record.nickname}</div>
          </div>
        </>
      ),
    },
    {
      title: '抖音号',
      width: 180,
      key: 'unionId',
      dataIndex: 'unionId',
      align: 'center',
    },
    {
      title: '联系方式',
      width: 180,
      key: 'mobile',
      dataIndex: 'mobile',
      align: 'center',
    },
    {
      title: '地址',
      width: 280,
      key: 'address',
      dataIndex: 'address',
      align: 'center',
    },
    {
      title: '最后发送时间',
      width: 200,
      key: 'lastReachedTime',
      dataIndex: 'lastReachedTime',
      align: 'center',
    },
  ];
  return (
    <div>
      <TopBox>
        <div style={{ background: '#fff', padding: '0 2rem' }}>
          <Title>今日实时监控数据</Title>
          <Box>
            <ShowBox>
              <Flex>
                <div>
                  <User>今日触达用户数</User>
                  <Total>{marketStatistics.todayReachCount}</Total>
                </div>
                <div>
                  <img src={touch} alt="" />
                </div>
              </Flex>
              <User>
                触达用户总数：<span>{marketStatistics.totalReachCount}</span>
              </User>
            </ShowBox>
            <ShowBox>
              <Flex>
                <div>
                  <User>消息回复总数</User>
                  <Total>{marketStatistics.todayReachCount}</Total>
                </div>
                <div>
                  <img src={reply} alt="" />
                </div>
              </Flex>
              <User>
                触达用户总数：<span>{marketStatistics.todayReachCount}</span>
              </User>
            </ShowBox>
          </Box>
        </div>
      </TopBox>
      <BottomBox>
        <SearchBox>
          <Form
            form={form}
            name="basic"
            layout="inline"
            onFinish={onFinish}
            initialValues={{
              searchType: 'nickname',
              lastReachedTime: [defaultSelectDate.startDate, defaultSelectDate.endDate],
            }}
          >
            <Form.Item label="消息发送时间" name="lastReachedTime">
              <RangePicker allowClear />
            </Form.Item>
            <Form.Item label="地区" name="address" style={{ marginLeft: '20px' }}>
              <Input placeholder="请输入地址" />
            </Form.Item>
            <Form.Item
              name="searchType"
              label=""
              style={{ marginLeft: '20px', width: '80px', marginRight: '0px' }}
            >
              <Select onChange={(e: string) => setSearchType(e)}>
                <Option value="nickname">昵称</Option>
                <Option value="mobile">手机号</Option>
                <Option value="unionId">抖音号</Option>
              </Select>
            </Form.Item>
            {searchType === 'mobile' && (
              <Form.Item name="searchValue">
                <InputNumber style={{ width: '100%' }} placeholder="请输入手机号" />
              </Form.Item>
            )}
            {(searchType === 'unionId' || searchType === 'nickname') && (
              <Form.Item name="searchValue">
                <Input placeholder={searchType === 'nickname' ? '请输入昵称' : '请输入抖音号'} />
              </Form.Item>
            )}
            <div className="search-btns">
              <Button style={{ marginRight: '10px' }} type="primary" htmlType="submit">
                <span style={{ fontSize: '14px' }} className="font_family icon-sousuo2">
                  &nbsp;查询
                </span>
              </Button>
              <Button htmlType="reset" onClick={reset}>
                <span style={{ fontSize: '14px' }} className="font_family icon-zhongzhi1">
                  &nbsp;重置
                </span>
              </Button>
            </div>
          </Form>
        </SearchBox>
        <Table
          columns={columns}
          dataSource={tableData?.data}
          pagination={false}
          scroll={{ x: 1300 }}
        />
        <div className="footer-sticky">
          <Pagination
            current={tableData?.pageIndex || 0}
            pageSize={tableData?.pageSize || 10}
            total={tableData?.totalCount || 0}
            showSizeChanger
            showTotal={(total) => `共 ${total} 条`}
            onChange={(current, pageSize) => pageChange({ current, pageSize })}
          />
        </div>
      </BottomBox>
    </div>
  );
};

const Title = styled.div`
  padding-bottom: 18px;
  mfont-family: PingFangSC-Medium;
  font-weight: Medium;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
`;
const MyAvatar = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
`;
const TopBox = styled.div`
  background: #f0f2f5;
  padding-bottom: 2rem;
`;
const Box = styled.div`
  display: flex;
  padding-bottom: 2rem;
`;
const ShowBox = styled.div`
  margin-right: 56px;
  padding: 25px 28px;
  width: 252px;
  height: 133px;
  background: rgba(0, 163, 255, 0.02);
  border: 1px solid rgba(0, 163, 255, 0.15);
  border-radius: 8px;
`;
const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Total = styled.div`
  padding: 5px 0;
  font-family: PingFangSC-Medium;
  font-weight: Medium;
  font-size: 24px;
`;
const User = styled.div`
  font-family: PingFangSC-Regular;
  font-weight: Regular;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
`;
const BottomBox = styled.div`
  padding-top: 2rem;
  margin: 0 2rem;
`;
const SearchBox = styled.div`
  margin-bottom: 2rem;
`;

export default UserManage;
