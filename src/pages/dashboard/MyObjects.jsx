import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import Drawer from "../../components/ui/Drawer";
import AddObjectForm from "../../components/forms/AddObjectForm";
import EditObjectForm from "../../components/forms/EditObjectForm";
import ObjectDetails from "../../components/dashboard/ObjectDetails";
import ConfirmationModal from "../../components/ui/ConfirmationModal";

const MyObjects = ({ showSnackbar, navigationParams }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [objects, setObjects] = useState([]);
  const [objectDetails, setObjectDetails] = useState(null);
  const [editingObject, setEditingObject] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (navigationParams && navigationParams.objectId) {
      fetchObjectDetails(navigationParams.objectId);
    }
  }, [navigationParams]);

  const fetchObjects = async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${apiUrl}/api/object`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const objectsList =
          data.objects || (Array.isArray(data) ? data : data.data || []);
        setObjects(objectsList);
      } else {
        console.error("Failed to fetch objects");
      }
    } catch (error) {
      console.error("Error fetching objects:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchObjectDetails = async (id) => {
    setDetailsLoading(true);
    setObjectDetails(null);
    setIsViewDrawerOpen(true);

    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${apiUrl}/api/object/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setObjectDetails(data.object || data);
      } else {
        showSnackbar("Nie udało się pobrać szczegółów obiektu.", "error");
        setIsViewDrawerOpen(false);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      showSnackbar("Błąd połączenia z serwerem.", "error");
      setIsViewDrawerOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchObjects();
  }, []);

  const handleEditClick = () => {
    setEditingObject(objectDetails);
    setIsViewDrawerOpen(false);
    setIsEditDrawerOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!objectDetails) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${apiUrl}/api/object/${objectDetails.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        showSnackbar("Obiekt został usunięty.", "success");
        setIsDeleteModalOpen(false);
        setIsViewDrawerOpen(false);
        setObjectDetails(null);
        fetchObjects();
      } else {
        showSnackbar("Nie udało się usunąć obiektu.", "error");
      }
    } catch (error) {
      console.error("Delete object error:", error);
      showSnackbar("Błąd połączenia z serwerem.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddObject = async (formData) => {
    setIsLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${apiUrl}/api/object`, {
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
        showSnackbar(
          data.message || "Obiekt został dodany pomyślnie.",
          "success",
        );
        setIsDrawerOpen(false);
        fetchObjects();
      } else {
        if (data.error && typeof data.error === "object") {
          setErrors(data.error);
          showSnackbar(
            data.message || "Sprawdź formularz pod kątem błędów.",
            "error",
          );
        } else {
          showSnackbar(
            data.message || data.error || "Błąd podczas dodawania obiektu.",
            "error",
          );
        }
      }
    } catch (error) {
      console.error("Add object error:", error);
      showSnackbar("Błąd połączenia z serwerem.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditObject = async (formData) => {
    if (!editingObject) return;

    setIsLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL;

      const response = await fetch(`${apiUrl}/api/object/${editingObject.id}`, {
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
          data.message || "Obiekt został zaktualizowany.",
          "success",
        );
        setIsEditDrawerOpen(false);
        setEditingObject(null);
        fetchObjects();
      } else {
        if (data.error && typeof data.error === "object") {
          setErrors(data.error);
          showSnackbar(
            data.message || "Sprawdź formularz pod kątem błędów.",
            "error",
          );
        } else {
          showSnackbar(
            data.message || data.error || "Błąd podczas aktualizacji obiektu.",
            "error",
          );
        }
      }
    } catch (error) {
      console.error("Update object error:", error);
      showSnackbar("Błąd połączenia z serwerem.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeLabel = (type) => {
    const types = {
      apartment: "Mieszkanie",
      house: "Dom",
      room: "Pokój",
    };
    return types[type] || type;
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
          Moje Obiekty
        </h1>
        <div style={{ width: "200px" }}>
          <Button
            onClick={() => {
              setErrors({});
              setEditingObject(null);
              setIsDrawerOpen(true);
            }}
          >
            + Dodaj obiekt
          </Button>
        </div>
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
      ) : objects.length > 0 ? (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nazwa</th>
                <th>Typ</th>
                <th>Kraj</th>
                <th>Miasto</th>
                <th>Adres</th>
              </tr>
            </thead>
            <tbody>
              {objects.map((obj, index) => (
                <tr
                  key={obj.id || index}
                  onClick={() => fetchObjectDetails(obj.id)}
                  style={{ cursor: "pointer" }}
                  className="clickable-row"
                >
                  <td style={{ fontWeight: 500, color: "var(--text-main)" }}>
                    {obj.name}
                  </td>
                  <td>{getTypeLabel(obj.type_of_building)}</td>
                  <td>{obj.country}</td>
                  <td>{obj.city}</td>
                  <td>
                    {obj.street} {obj.house_number}
                    {obj.apartment_number ? `/${obj.apartment_number}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p className="page-text">Nie masz jeszcze żadnych nieruchomości.</p>
          <p className="page-text" style={{ fontSize: "0.9rem" }}>
            Kliknij przycisk powyżej, aby dodać pierwszą.
          </p>
        </div>
      )}

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Dodaj nowy obiekt"
      >
        <AddObjectForm
          onSubmit={handleAddObject}
          onCancel={() => setIsDrawerOpen(false)}
          isLoading={isLoading}
          errors={errors}
        />
      </Drawer>

      <Drawer
        isOpen={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false);
          setEditingObject(null);
        }}
        title="Edytuj obiekt"
      >
        <EditObjectForm
          onSubmit={handleEditObject}
          onCancel={() => {
            setIsEditDrawerOpen(false);
            setEditingObject(null);
          }}
          isLoading={isLoading}
          errors={errors}
          objectData={editingObject}
        />
      </Drawer>

      <Drawer
        isOpen={isViewDrawerOpen}
        onClose={() => setIsViewDrawerOpen(false)}
        title="Szczegóły obiektu"
      >
        <ObjectDetails
          data={objectDetails}
          isLoading={detailsLoading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </Drawer>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Usuń obiekt"
        message="Czy na pewno chcesz usunąć ten obiekt? Tej operacji nie można cofnąć."
        confirmText="Usuń"
        isDestructive={true}
      />
    </div>
  );
};

export default MyObjects;
