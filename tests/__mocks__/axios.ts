const mockAxiosInstance = {
    /* the methods your code may call */
    request: jest.fn(),      //  ←  add this
    post   : jest.fn(),
    get    : jest.fn(),
    put    : jest.fn(),
    patch  : jest.fn(),
    delete : jest.fn(),
  
    /* support axios.create() if used anywhere */
    create: () => mockAxiosInstance,
  };
  
  export default mockAxiosInstance;
  