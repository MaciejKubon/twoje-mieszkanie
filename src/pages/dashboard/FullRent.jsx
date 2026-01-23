import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import Drawer from "../../components/ui/Drawer";
import AddFullRentForm from "../../components/forms/AddFullRentForm";
import EditFullRentForm from "../../components/forms/EditFullRentForm";
import FullRentDetails from "../../components/dashboard/FullRentDetails";
import ConfirmationModal from "../../components/ui/ConfirmationModal";

const FullRent = ({ showSnackbar, onNavigate }) => {
  const [rentList, setRentList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Details/Edit/Delete State
  const [selectedRent, setSelectedRent] = useState(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingRent, setEditingRent] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [paginationMeta, setPaginationMeta] = useState(null);
  const userRole = localStorage.getItem("role");

  const fetchRents = async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(
        `${apiUrl}/api/fullRent?page=${page}&per_page=${perPage}&sort_by=${sortBy}&order=${order}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        const list = data.data || (Array.isArray(data) ? data : []);
        setRentList(list);

        // Extract pagination meta
        if (data.current_page) {
          setPaginationMeta({
            current_page: data.current_page,
            last_page: data.last_page,
            from: data.from,
            to: data.to,
            total: data.total,
          });
        }
      } else {
        console.warn("Failed to fetch rents");
      }
    } catch (error) {
      console.error("Error fetching rents:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchRentDetails = async (id) => {
    setDetailsLoading(true);
    setSelectedRent(null);
    setIsDetailsDrawerOpen(true);

    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${apiUrl}/api/fullRent/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const details = data.fullRent || data;
        // If it's an array, try to find the one matching the requested ID, otherwise fallback to index 0
        if (Array.isArray(details)) {
          const found = details.find((item) => item.id == id); // loose comparison for string/number
          setSelectedRent(found || details[0]);
        } else {
          setSelectedRent(details);
        }
      } else {
        showSnackbar("Nie udało się pobrać szczegółów czynszu.", "error");
        setIsDetailsDrawerOpen(false);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      showSnackbar("Błąd połączenia z serwerem.", "error");
      setIsDetailsDrawerOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchRents();
  }, [sortBy, order, page, perPage]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setOrder("asc");
    }
  };

  const handleAddRent = async (formData) => {
    setIsLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${apiUrl}/api/fullRent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        showSnackbar("Czynsz został dodany pomyślnie.", "success");
        setIsDrawerOpen(false);
        fetchRents();
      } else {
        if (data.error && typeof data.error === "object") {
          setErrors(data.error);
          showSnackbar(
            data.message || "Sprawdź formularz pod kątem błędów.",
            "error",
          );
        } else {
          showSnackbar(
            data.message || data.error || "Błąd podczas dodawania czynszu.",
            "error",
          );
        }
      }
    } catch (error) {
      console.error("Add rent error:", error);
      showSnackbar("Błąd połączenia z serwerem.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditingRent(selectedRent);
    setIsDetailsDrawerOpen(false);
    setIsEditDrawerOpen(true);
  };

  const handleEditRent = async (formData) => {
    if (!editingRent) return;

    setIsLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${apiUrl}/api/fullRent/${editingRent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        showSnackbar(
          data.message || "Czynsz został zaktualizowany.",
          "success",
        );
        setIsEditDrawerOpen(false);
        setEditingRent(null);
        fetchRents();
      } else {
        if (data.error && typeof data.error === "object") {
          setErrors(data.error);
          showSnackbar(
            data.message || "Sprawdź formularz pod kątem błędów.",
            "error",
          );
        } else {
          showSnackbar(
            data.message || data.error || "Błąd podczas edycji czynszu.",
            "error",
          );
        }
      }
    } catch (error) {
      console.error("Edit rent error:", error);
      showSnackbar("Błąd połączenia z serwerem.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRent) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(
        `${apiUrl}/api/fullRent/${selectedRent.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (response.ok) {
        showSnackbar("Czynsz został usunięty.", "success");
        setIsDeleteModalOpen(false);
        setIsDetailsDrawerOpen(false);
        setSelectedRent(null);
        fetchRents();
      } else {
        showSnackbar("Nie udało się usunąć czynszu.", "error");
      }
    } catch (error) {
      console.error("Delete rent error:", error);
      showSnackbar("Błąd połączenia z serwerem.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRent = async () => {
    if (!selectedRent) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(
        `${apiUrl}/api/fullRent/accept/${selectedRent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({ is_accepted: true }),
        },
      );

      if (response.ok) {
        showSnackbar("Czynsz został zaakceptowany.", "success");
        fetchRentDetails(selectedRent.id);
        fetchRents();
      } else {
        showSnackbar("Nie udało się zaakceptować czynszu.", "error");
      }
    } catch (error) {
      console.error("Accept rent error:", error);
      showSnackbar("Błąd połączenia z serwerem.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPaid = async () => {
    if (!selectedRent) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(
        `${apiUrl}/api/fullRent/confirmPaid/${selectedRent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({ is_paid: true }),
        },
      );

      if (response.ok) {
        showSnackbar("Płatność została potwierdzona.", "success");
        fetchRentDetails(selectedRent.id);
        fetchRents();
      } else {
        showSnackbar("Nie udało się potwierdzić płatności.", "error");
      }
    } catch (error) {
      console.error("Confirm paid error:", error);
      showSnackbar("Błąd połączenia z serwerem.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (rent) => {
    fetchRentDetails(rent.id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pl-PL");
  };

  const renderSortIcon = (column) => {
    if (sortBy !== column)
      return <span style={{ marginLeft: "5px", opacity: 0.3 }}>⇅</span>;
    return (
      <span style={{ marginLeft: "5px" }}>{order === "asc" ? "↑" : "↓"}</span>
    );
  };

  return (
    <div>
      <div
        className="page-header-actions"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 className="page-header" style={{ marginBottom: 0 }}>
          Czynsz
        </h1>
        {userRole === "owner" && (
          <div style={{ width: "200px" }}>
            <Button variant="primary" onClick={() => setIsDrawerOpen(true)}>
              + Dodaj czynsz
            </Button>
          </div>
        )}
      </div>

      {isFetching ? (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "var(--text-muted)",
          }}
        >
          Ładowanie...
        </div>
      ) : rentList.length > 0 ? (
        <>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort("object_name")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                    className={sortBy === "object_name" ? "sorted-header" : ""}
                  >
                    Obiekt {renderSortIcon("object_name")}
                  </th>
                  <th
                    onClick={() =>
                      handleSort(userRole === "owner" ? "renter" : "owner")
                    }
                    style={{ cursor: "pointer", userSelect: "none" }}
                    className={
                      sortBy === (userRole === "owner" ? "renter" : "owner")
                        ? "sorted-header"
                        : ""
                    }
                  >
                    {userRole === "owner" ? "Najemca" : "Właściciel"}{" "}
                    {renderSortIcon(userRole === "owner" ? "renter" : "owner")}
                  </th>
                  <th
                    onClick={() => handleSort("amount")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                    className={sortBy === "amount" ? "sorted-header" : ""}
                  >
                    Kwota {renderSortIcon("amount")}
                  </th>
                  <th
                    onClick={() => handleSort("date")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                    className={sortBy === "date" ? "sorted-header" : ""}
                  >
                    Termin {renderSortIcon("date")}
                  </th>
                  <th
                    onClick={() => handleSort("is_paid")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                    className={sortBy === "is_paid" ? "sorted-header" : ""}
                  >
                    Płatność {renderSortIcon("is_paid")}
                  </th>
                  <th
                    onClick={() => handleSort("is_accepted")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                    className={sortBy === "is_accepted" ? "sorted-header" : ""}
                  >
                    Akceptacja {renderSortIcon("is_accepted")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rentList.map((rent, index) => (
                  <tr
                    key={rent.id || index}
                    className="clickable-row"
                    onClick={() => handleRowClick(rent)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{rent.object_name}</td>
                    <td>
                      {userRole === "owner" ? (
                        <>
                          <div>{rent.renter_name}</div>
                          <div className="text-sm text-muted">
                            {rent.renter_email}
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            {rent.owner_first_name} {rent.owner_last_name}
                          </div>
                          <div className="text-sm text-muted">
                            {rent.owner_email}
                          </div>
                        </>
                      )}
                    </td>
                    <td>
                      {typeof rent.amount === "number"
                        ? rent.amount.toFixed(2)
                        : rent.amount}{" "}
                      PLN
                    </td>
                    <td>{formatDate(rent.date)}</td>
                    <td>
                      <span
                        className={`status-badge ${rent.is_paid ? "success" : "error"}`}
                      >
                        {rent.is_paid ? "Opłacony" : "Nieopłacony"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${rent.is_accepted ? "primary" : "warning"}`}
                      >
                        {rent.is_accepted ? "Zaakceptowany" : "Oczekuje"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginationMeta && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "2rem",
                marginBottom: "1rem",
                padding: "0 1rem",
              }}
            >
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Wyświetlono {paginationMeta.from}-{paginationMeta.to} z{" "}
                {paginationMeta.total}
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button
                  variant="outline"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  size="sm"
                >
                  &laquo; Poprzednia
                </Button>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0 0.5rem",
                  }}
                >
                  Strona {paginationMeta.current_page} z{" "}
                  {paginationMeta.last_page}
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setPage((prev) =>
                      Math.min(paginationMeta.last_page, prev + 1),
                    )
                  }
                  disabled={page === paginationMeta.last_page}
                  size="sm"
                >
                  Następna &raquo;
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <p className="page-text">Brak historii czynszów.</p>
          <p className="page-text" style={{ fontSize: "0.9rem" }}>
            Kliknij przycisk powyżej, aby dodać nowy rekord.
          </p>
        </div>
      )}

      {/* Add Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Dodaj czynsz"
      >
        <AddFullRentForm
          onSubmit={handleAddRent}
          onCancel={() => setIsDrawerOpen(false)}
          isLoading={isLoading}
          errors={errors}
        />
      </Drawer>

      <Drawer
        isOpen={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false);
          setEditingRent(null);
        }}
        title="Edytuj czynsz"
      >
        <EditFullRentForm
          onSubmit={handleEditRent}
          onCancel={() => {
            setIsEditDrawerOpen(false);
            setEditingRent(null);
          }}
          isLoading={isLoading}
          errors={errors}
          rentData={editingRent}
        />
      </Drawer>

      <Drawer
        isOpen={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        title="Szczegóły czynszu"
      >
        <FullRentDetails
          data={selectedRent}
          isLoading={detailsLoading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onNavigate={onNavigate}
          onAccept={handleAcceptRent}
          onConfirmPaid={handleConfirmPaid}
        />
      </Drawer>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Usuń czynsz"
        message="Czy na pewno chcesz usunąć ten zapis czynszu? Tej operacji nie można cofnąć."
        confirmText="Usuń"
        isDestructive={true}
      />
    </div>
  );
};

export default FullRent;
