import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../../../service/ApiService";
import Pagination from "../../common/pagination/Pagination";
import style from "./ManageUsersPage.module.css";
import Toast from "../../common/toast/Toast";
import { useNavigate } from "react-router";
import { useConfirm } from "../../../hooks/useConfirm";
import ConfirmDialog from "../../common/confirm-dialog/ConfirmDialog";

function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [toast, setToast] = useState({ message: "", type: "success" });
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(6);
    const navigate = useNavigate();
    const { confirm, config } = useConfirm();

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
            setToast({ message: "Hiba a felhasználók lekérésekor." || err.message, type: "error" });
        }
    }

    async function handleDelete(userId) {
        const ok = await confirm({
            title: "Felhasználó törlése",
            message: `Biztosan törölni szeretnéd ${users.find((u) => u.id === userId)?.name || "az adott felhasználót"} fiókját? Ez a művelet visszafordíthatatlan!`,
            confirmText: "Törlés",
            cancelText: "Mégse",
            confirmVariant: "danger",
        });
        if (!ok) return;
        try {
            await deleteUser(userId);
            setUsers(users.filter((u) => u.id !== userId));
            setToast({ message: "Felhasználó sikeresen törölve!", type: "success" });
        } catch (err) {
            setToast({ message: "Hiba a felhasználó törlésekor." || err.message, type: "error" });
        }
    }

    const currentUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    return (
        <div className={style.manageUsersWrapper}>
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
            <div className={style.manageUsersPage}>

                {/* HEADER */}
                <div className={style.header}>
                    <div>
                        <span className={style.badge}>Admin / Felhasználók</span>
                        <h2 className={style.title}>Felhasználók <span>kezelése</span></h2>
                        <p className={style.subtitle}>Felhasználók listázása, keresése és törlése.</p>
                    </div>
                    <span className={style.userCount}>
                        Találat: <strong>{filteredUsers.length} felhasználó</strong>
                    </span>
                    <button className={style.backButton} onClick={() => navigate("/admin")}>← Vissza</button>
                </div>

                {/* KERESÉS */}
                <div className={style.searchContainer}>
                    <span className={style.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Keresés név alapján..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={style.searchInput}
                    />
                </div>

                {/* LISTA */}
                <div className={style.userList}>
                    {currentUsers.length > 0 ? (
                        currentUsers.map((user) => (
                            <div key={user.id} className={style.userItem}>
                                <div className={style.userItemInner}>
                                    <div className={style.userHeader}>
                                        <div className={style.userAvatar}>
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className={style.userNameBlock}>
                                            <span className={style.userName}>{user.name}</span>
                                            <span className={`${style.roleBadge} ${user.role === "ROLE_ADMIN" ? style.admin : style.user}`}>
                                                {user.role === "ROLE_ADMIN" ? "Admin" : "Felhasználó"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={style.divider} />
                                    <div className={style.fields}>
                                        <div className={style.field}>
                                            <span className={style.fieldLabel}>Email</span>
                                            <span className={style.fieldValue}>{user.email}</span>
                                        </div>
                                        <div className={style.field}>
                                            <span className={style.fieldLabel}>Telefonszám</span>
                                            <span className={style.fieldValue}>{user.phoneNumber}</span>
                                        </div>
                                    </div>
                                    <button className={style.deleteButton} onClick={() => handleDelete(user.id)}>
                                        Felhasználó törlése
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={style.emptyState}>
                            <div className={style.emptyIcon}>👥</div>
                            <p>Nem található felhasználó.</p>
                        </div>
                    )}
                </div>

                <div className={style.paginationWrapper}>
                    <Pagination
                        roomsPerPage={usersPerPage}
                        totalRooms={filteredUsers.length}
                        currentPage={currentPage}
                        paginate={(page) => setCurrentPage(page)}
                    />
                </div>

            </div>
            {config && <ConfirmDialog {...config} />}
        </div>
    );
}

export default ManageUsersPage;