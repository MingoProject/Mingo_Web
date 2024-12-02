export interface Teacher {
  id: string;
  name: string;
  birth: Date;
  email: string;
  phone: string;
  ava: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
  more: string;
}

export interface TeacherCourse {
  teacher: Teacher;
  course: {
    id: string;
    name: string;
  };
  joinDate: Date;
  kindJob: string;
  description: string;
  earning: number;
  point: number;
  status: string;
}

export interface FilterProps {
  startDate: Date | undefined;
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  endDate: Date | undefined;
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  filterInput: string;
  setFilterInput: React.Dispatch<React.SetStateAction<string>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}

export interface PaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  indexOfLastItem: number;
  indexOfFirstItem: number;
  totalPages: number;
  dataLength: number;
}

export interface TableProps {
  indexOfLastItem: number;
  indexOfFirstItem: number;
  filterInput: string;
  inputValue: string;
}
