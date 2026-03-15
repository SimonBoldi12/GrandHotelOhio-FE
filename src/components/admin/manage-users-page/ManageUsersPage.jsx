import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../../service/ApiService";
import Pagination from "../../common/pagination/Pagination";
import style from "./ManageUsersPage.module.css";
import Toast from "../../../common/toast/Toast";

function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [toast, setToast] = useState({ message: "", type: "success" });
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(6);

    useEffect(() => { fetchUsers(); }, []);

    useEffect(() => {
        setFilteredUsers(
            searchTerm === "" ? users : users.filter((u) => u.name?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setCurrentPage(1);
    }, [searchTerm, users]);

    async function fetchUsers() {
        try {
            const response = await getAllUsers();
            setUsers(response.userList || response.users || []);
        } catch (err) {
            setToast({ message: err.response?.data?.message || err.message, type: "error" });
        }
    }

    async function handleDelete(userId) {
        if (!window.confirm("Biztosan törölni szeretnéd ezt a felhasználót?")) return;
        try {
            await deleteUser(userId);
            setUsers(users.filter((u) => u.id !== userId));
            setToast({ message: "Felhasználó sikeresen törölve!", type: "success" });
        } catch (err) {
            setToast({ message: err.response?.data?.message || err.message, type: "error" });
        }
    }

    const indexOfLast = currentPage * usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfLast - usersPerPage, indexOfLast);

    return (
        <div className={style.manageUsersPage}>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
            <h2 className={style.title}>Felhasználók kezelése</h2>
            <div className={style.searchContainer}>
                <input type="text" placeholder="Keresés név alapján..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={style.searchInput} />
            </div>
            <div className={style.userList}>
                {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                        <div key={user.id} className={style.userItem}>
                            <p><strong>Név:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Telefonszám:</strong> {user.phoneNumber}</p>
                            <p><strong>Szerepkör:</strong> {user.role}</p>
                            <button className={style.deleteButton} onClick={() => handleDelete(user.id)}>Törlés</button>
                        </div>
                    ))
                ) : (
                    <p className={style.noResults}>Nincs találat.</p>
                )}
            </div>
            <Pagination roomsPerPage={usersPerPage} totalRooms={filteredUsers.length} currentPage={currentPage} paginate={(page) => setCurrentPage(page)} />
        </div>
    );
}

export default ManageUsersPage;