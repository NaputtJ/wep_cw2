export type OptionType = {
  value: boolean | number | string,
  lable: string
}

export type AssessmentType = {
  id: string,
  title: string,
  module_code: string,
  deadline: string,
  desc: string,
  status: boolean
}

export enum FormState {
  ADD = 0,
  EDIT
}

export interface IProductCategory {
  id: number,
  name: string
}

export type ImgSrcType = {
  key: string,
  src?: string | null
}

type Override<T, R> = Omit<T, keyof R> & R;

export interface IProductBase {
  name: string
  product_category_id: number
  imgs: ImgSrcType[]
  price: string
  stock: string
  desc: string
}

export type IProduct = Override<IProductBase, {
  imgs: string[]
  stock: number
  price: number
}> & {
  id: number
  key?: string
  user_id: number
  seller_name?: string
  seller_email: string
  sold_amount: number
};

export interface IOrderItem {
  id: number,
  key?: string
  quantity: number,
  product: IProduct
}

export interface IOrder {
  id: number,
  key?: string
  seller_id: number,
  seller_name?: string,
  seller_email: string,
  status: number,
  items: IOrderItem[]
}

export interface IUser {
  id: number,
  name: string,
  email: string,
  phone_number: string,
  address: string,
  city: string,
  zip_code: string
}

export interface ISeller extends IUser {
  product_count: number
}
