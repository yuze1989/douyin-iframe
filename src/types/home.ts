export interface TableItem {
    id?: string;
    nickname?: string;
    avatar?: string;
    unionId?: string;
    mobile?: string;
    address?: string;
    lastReachedTime?: Date;
    isFans?: boolean
  }
export interface TableDataType{
    pageIndex?: number;
    pageSize?: number;
    totalCount?: number;
    data?: TableItem[]
  }

export interface MarketStatistics {
    todayReachCount?: number;
    totalReachCount?: number;
    todayReplyCount?: number;
    totalReplyCount?: number;
  }

export interface ParmasType {
    openId?: string;
    lastReachedTimeGE?: Date;
    lastReachedTimeLE?: Date;
    address?: string;
    searchType?: string;
    searchValue?: string;
    pageIndex?: number;
    pageSize?: number;
  }
export interface EnterpriseMsgType {
  enterpriseCode?: string;
  enterpriseSecret?: string;
  }
