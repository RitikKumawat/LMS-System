export interface TColumns<T> {
    key: keyof T;
    label: string;
    render: (val:T) => React.ReactNode;
    minWidth?:number;
    filter:boolean;
}

type FilterConfig = {
  label: string;
  key: FilterKey;
  options: string[];
};
