import Link from "next/link";

const Pagination = ({ count, perPage, currentPage }: PaginationProps) => {
  const pageCount = Math.ceil(count / perPage);

  if (pageCount === 1) {
    return null;
  }

  // const changePage = (page) => {
  //   if (page <= 0 || page > pageCount) {
  //     return;
  //   }
  //   setCurrentPage(page);
  // };

  return (
    <div className="w-full flex justify-between">
      <div className="flex items-center">
        <div className="">
          <Link href={`?page=${currentPage - 1}`}>
            <a
              className={`mr-4 px-2 py-2 inline-flex items-center ${
                currentPage === 1 && " text-gray-500 pointer-events-none"
              } text-sm leading-5 font-medium hover:bg-gray-100 rounded-lg focus:outline-none transition ease-in-out duration-150`}
            >
              Previous
            </a>
          </Link>
        </div>
        <ul className="flex pl-0 list-none rounded my-2">
          {[...Array(pageCount)].map((e, page) => (
            <li className="cursor-pointer" key={page + 1}>
              <Link href={`?page=${page + 1}`}>
                <a className="px-3 py-2 text-center inline-flex items-center text-sm leading-5 font-medium hover:text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-none transition ease-in-out duration-150">
                  {page + 1}
                </a>
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex justify-end">
          <Link href={`?page=${currentPage + 1}`}>
            <a
              className={`ml-4 px-2 py-2 inline-flex items-center ${
                currentPage === pageCount &&
                " text-gray-500 pointer-events-none"
              } text-sm leading-5 font-medium hover:bg-gray-100 rounded-lg focus:outline-none transition ease-in-out duration-150`}
            >
              Next
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

type PaginationProps = {
  count: number;
  perPage: number;
  currentPage: number;
};

export default Pagination;
