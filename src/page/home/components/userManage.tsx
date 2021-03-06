import React, { useEffect, useState } from 'react';
import moment from 'moment';
import http from 'utils/http';
import styled from '@emotion/styled';
import { ColumnsType } from 'antd/lib/table';
import {
  Form, Input, DatePicker, Select, Button, Table, Pagination, TablePaginationConfig, InputNumber,
  Radio,
} from 'antd';
import {
  TableItem, TableDataType, MarketStatistics, ParmasType, TiktokList,
} from 'types/home';

const { Option } = Select;
interface Props {
  openId: string;
}
const UserManage = (props: Props) => {
  const { openId } = props;
  const [form] = Form.useForm();
  const [searchType, setSearchType] = useState('nickname');
  const [marketStatistics, setMarketStatistics] = useState<MarketStatistics>({});
  const [tableData, setTableData] = useState<TableDataType>();
  const { RangePicker } = DatePicker;
  const [tiktokList, setTiktokList] = useState<TiktokList[]>();
  const [tiktokUserId, setTiktokUserId] = useState<string | number>('');
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
      value.lastReachedTimeGE = moment(startTime).format('YYYY/MM/DD');
      value.lastReachedTimeLE = moment(endTime).format('YYYY/MM/DD');
    }
    value.tiktokUserId = tiktokUserId;
    delete value.lastReachedTime;
    if (openId) {
      http.get('/social/service-market/list-reach-record', { ...value, ...parmas }).then((res) => {
        const { success } = res;
        if (success) {
          setTableData(res);
        }
      });
    }
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
    if (openId) {
      http.get('/social/service-market/statistics', { tiktokUserId }).then((res) => {
        const { success, data } = res;
        if (success) {
          setMarketStatistics(data);
        }
      });
    }
  };
  const getTiktokAccount = () => {
    if (openId) {
      http.get('/social/auto-reply-rule/list-tiktok-user', {}).then((res) => {
        const { success, data } = res;
        if (success) {
          setTiktokList(data);
        }
      });
    }
  };
  useEffect(() => {
    getStatistics();
    getTiktokList();
  }, [tiktokUserId]);
  useEffect(() => {
    getTiktokAccount();
  }, []);

  const columns: ColumnsType<TableItem> = [
    {
      title: '????????????',
      width: 280,
      key: 'nickname',
      dataIndex: 'nickname',
      fixed: 'left',
      align: 'left',
      render: (text, record) => (
        <>
          <div className="userInfoBox">
            <MyAvatar>
              <div className="imgbox">
                {record.avatar && (
                  <img style={{ marginBottom: '-10px' }} src={record.avatar} alt="" />
                )}
              </div>
              {record.isFans && <div className="fans">??????</div>}
            </MyAvatar>
            <div className="nickname">{record.nickname}</div>
          </div>
        </>
      ),
    },
    {
      title: '???V???',
      width: 180,
      key: 'tiktokNumber',
      dataIndex: 'tiktokNumber',
      align: 'left',
    },
    {
      title: '????????????',
      width: 180,
      key: 'mobile',
      dataIndex: 'mobile',
      align: 'left',
    },
    {
      title: '??????',
      width: 280,
      key: 'address',
      dataIndex: 'address',
      align: 'left',
    },
    {
      title: '??????????????????',
      width: 200,
      key: 'lastReachedTime',
      dataIndex: 'lastReachedTime',
      align: 'left',
    },
  ];
  return (
    <div>
      <AccountBox>
        <div>
          ?????????V??????
          <Radio.Group
            defaultValue=""
            buttonStyle="solid"
            onChange={(e) => {
              setTiktokUserId(e.target.value);
            }}
          >
            <Radio.Button value="">??????</Radio.Button>
            {
              tiktokList && tiktokList.map((item) => (
                <Radio.Button value={item.id} key={item.id}>{item.nickname}</Radio.Button>
              ))
            }
          </Radio.Group>
        </div>
      </AccountBox>
      <TopBox>
        <div className="numberChart">
          {/* <Title>????????????????????????</Title> */}
          <Box>
            <ShowBox>
              <Flex>
                <div>
                  <User>?????????????????????</User>
                  <Total>{marketStatistics.todayReachCount}</Total>
                </div>
                <div>
                  <img className="chartIcon" src="https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/douyin/touch.png" alt="" />
                </div>
              </Flex>
              <User>
                ?????????????????????<span>{marketStatistics.totalReachCount}</span>
              </User>
            </ShowBox>
            <ShowBox>
              <Flex>
                <div>
                  <User>?????????????????????</User>
                  <Total>{marketStatistics.todayReplyCount}</Total>
                </div>
                <div>
                  <img className="chartIcon" src="https://jz-scrm.oss-cn-hangzhou.aliyuncs.com/web/douyin/reply.png" alt="" />
                </div>
              </Flex>
              <User>
                ?????????????????????<span>{marketStatistics.totalReplyCount}</span>
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
            <Form.Item label="??????????????????" name="lastReachedTime">
              <RangePicker allowClear={false} />
            </Form.Item>
            <Form.Item label="??????" name="address" className="marginLeft10">
              <Input placeholder="???????????????" />
            </Form.Item>
            <Form.Item
              name="searchType"
              className="nameCondition marginLeft10"
            >
              <Select onChange={(e: string) => setSearchType(e)}>
                <Option value="nickname">??????</Option>
                <Option value="mobile">?????????</Option>
                <Option value="tiktokNumber">?????????</Option>
              </Select>
            </Form.Item>
            {searchType === 'mobile' && (
              <Form.Item name="searchValue">
                <InputNumber style={{ width: '100%' }} placeholder="??????????????????" />
              </Form.Item>
            )}
            {(searchType === 'tiktokNumber' || searchType === 'nickname') && (
              <Form.Item name="searchValue">
                <Input placeholder={searchType === 'nickname' ? '???????????????' : '??????????????????'} />
              </Form.Item>
            )}
            <div className="search-btns">
              <Button style={{ marginRight: '10px' }} type="primary" htmlType="submit">
                <span className="font_family icon-sousuo2 fontSize14">
                  &nbsp;??????
                </span>
              </Button>
              <Button htmlType="reset" onClick={reset}>
                <span className="font_family icon-zhongzhi1 fontSize14">
                  &nbsp;??????
                </span>
              </Button>
            </div>
          </Form>
        </SearchBox>
        <Table
          style={{ margin: '0 2rem' }}
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
            showTotal={(total) => `??? ${total} ???`}
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
  .imgbox {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    overflow: hidden;
    background: #ccc;
    margin-right: 5px;
  }
  img {
    width: 100%;
    height: 100%;
  }
  .fans {
    margin-bottom: -16px !important;
    position: relative;
    left: 8px;
    top: -15px;
    z-index: 100;
    width: 38px;
    height: 20px;
    background: #f2867c;
    border-radius: 10px;
    font-family: PingFangSC-Regular;
    font-weight: Regular;
    font-size: 12px;
    color: #ffffff;
    text-align: center;
  }
`;
const AccountBox = styled.div`
  margin-bottom: 16px; 
  padding: 0 2rem;
  .ant-radio-button-wrapper{
    margin: 0 16px;
    padding: 0 40px;
    height: 36px;
    line-height: 36px;
    border-radius: 4px;
    border: none;
    color: #000000;
    background: #F9F9F9;
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover,
  .ant-radio-button-wrapper-checked:hover{
    color: #1890FF;
    border:none;
    background: rgba(24,144,255,0.06);
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled){
    color: #1890FF;
    border:none;
    background: rgba(24,144,255,0.06);
  }
  .ant-radio-button-wrapper:not(:first-child)::before{
    content: none;
  }
  .ant-radio-button-wrapper:first-child{
    border-left: none;
  }
`;
const TopBox = styled.div`
  background: #f0f2f5;
  padding-bottom: 2rem;
  .numberChart{
    padding: 0 2rem;
    background: #FFFFFF;
  }
  .chartIcon{
    width: 5.4rem;
    height: 5rem;
  }
`;
const Box = styled.div`
  display: flex;
  padding-bottom: 2rem;
`;
const ShowBox = styled.div`
  margin-right: 56px;
  padding: 25px 28px;
  width: 252px;
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
  padding-top: 4px;
  .userInfoBox{
    display: flex;
    align-items: center;
  }
`;
const SearchBox = styled.div`
  margin: 2rem 2rem;
  .fontSize14{
    font-size: 14px;
  }
  .marginLeft10{
    margin-left: 1rem;
  }
  .nameCondition{
    margin-right: 0px;
    width: 90px;
  }
  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border-right: 0;
    border-radius: 0;
  }
`;

export default UserManage;
