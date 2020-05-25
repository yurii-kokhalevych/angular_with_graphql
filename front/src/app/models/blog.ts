export interface IBlog {
  _id: string;
  title: string;
  description: string;
  creatorId: string;
  creator?: object;
  name?: string;
  createdAt: string;
}


export interface IGetBlog {
  blog: IBlog;
}

export interface ICreateBlog {
  createBlog: IBlog;
}

export interface IUpdateBlog {
  updateBlog: IBlog;
}

export interface IRemoveBlog {
  deleteBlog: {
    blogId: string;
  };
}

export interface IFilteredData {
  filterBlogs: IBlog[];
}
