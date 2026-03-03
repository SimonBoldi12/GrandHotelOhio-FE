import style from "./Pagination.module.css";

function Pagination({ roomsPerPage, totalRooms, currentPage, paginate }) {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalRooms / roomsPerPage); i++) {
        pageNumbers.push(i);
    }

    return ( 
        <div className={style.paginationNav}>
            <ul className={style.paginationUl}>
                {pageNumbers.map((number) => (
                    <li key={number} className={style.paginationLi}>
                        <button onClick={() => paginate(number)} className={`${style.paginationButton} ${currentPage === number ? style.active : ""}`}>
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Pagination;