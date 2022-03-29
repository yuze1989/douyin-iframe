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

export interface TiktokList {
  apiAuthorId?: number
  avatar?: string
  city?: string
  country?: string
  creator?: string
  gender?: number
  gmtCreate?: string
  gmtModified?: string
  id?: number | ''
  mobile?: number | null
  modifier?: string
  nickname?: string
  openId?: string
  province?: string
  tenantId?: string | null
  unionId?: string
}

export interface RegulationDataType {
  id?: string;
  name?: string;
  tenantId?: number;
  tiktokUserId?: number;
  status?: number;
  keyWordList?: object[];
  messageList?: object[];
}

export interface KeyWordListType {
  creator?: string;
  gmtCreate?: string;
  gmtModified?: string;
  id?: number;
  keyWord?: string;
  modifier?: string;
  ruleId?: number;
  tenantId?: string;
  type?: number;
}

export interface MessageListType {

}

export interface RegulationItem {
  businessType?: number;
  data?: RegulationDataType[];
  pageIndex?: number;
  pageSize?: number;
  success?: boolean;
  totalCount?: number;
  totalPages?: number;
}

// 互动方案 tableData
export interface InteractTableDataType{
  pageIndex?: number;
  pageSize?: number;
  totalCount?: number;
  data?: RegulationDataType[]
}

export interface paginationDataType {
  pageIndex?: number;
  pageSize?: number;
}
