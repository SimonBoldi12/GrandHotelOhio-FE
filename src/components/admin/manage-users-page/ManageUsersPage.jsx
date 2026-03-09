import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../../service/ApiService";
import Pagination from "../../common/pagination/Pagination";
import style from "./ManageUsersPage.module.css";

function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(6);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredUsers(users);
        } else {
            setFilteredUsers(
                users.filter((u) =>
                    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
        setCurrentPage(1);
    }, [searchTerm, users]);

    async function fetchUsers() {
        try {
            const response = await getAllUsers();
            setUsers(response.userList || response.users || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    }

    async function handleDelete(userId) {
        if (!window.confirm("Biztosan törölni szeretnéd ezt a felhasználót?")) return;
        try {
            await deleteUser(userId);
            setUsers(users.filter((u) => u.id !== userId));
            setSuccess("Felhasználó sikeresen törölve!");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setTimeout(() => setError(null), 3000);
        }
    }

    const indexOfLast = currentPage * usersPerPage;
    const indexOfFirst = indexOfLast - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

    return (
        <div className={style.manageUsersPage}>
            <h2 className={style.title}>Felhasználók kezelése</h2>
            {error && <p className={style.error}>{error}</p>}
            {success && <p className={style.success}>{success}</p>}
            <div className={style.searchContainer}>
                <input
                    type="text"
                    placeholder="Keresés név alapján..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={style.searchInput}
                />
            </div>
            <div className={style.userList}>
                {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                        <div key={user.id} className={style.userItem}>
                            <p><strong>Név:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Telefonszám:</strong> {user.phoneNumber}</p>
                            <p><strong>Szerepkör:</strong> {user.role}</p>
                            <button className={style.deleteButton} onClick={() => handleDelete(user.id)}>
                                Törlés
                            </button>
                        </div>
                    ))
                ) : (
                    <p className={style.noResults}>Nincs találat.</p>
                )}
            </div>
            <Pagination
                roomsPerPage={usersPerPage}
                totalRooms={filteredUsers.length}
                currentPage={currentPage}
                paginate={(page) => setCurrentPage(page)}
            />
        </div>
    );
}

export default ManageUsersPage;