import { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Drawer from '../../components/ui/Drawer';
import AddRentAssignmentForm from '../../components/forms/AddRentAssignmentForm';
import EditRentAssignmentForm from '../../components/forms/EditRentAssignmentForm';
import RentAssignmentDetails from '../../components/dashboard/RentAssignmentDetails';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

const RentAssignment = ({ showSnackbar }) => {
  const [rentAssignments, setRentAssignments] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Details drawer state
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const fetchRentAssignments = async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${apiUrl}/api/rentAssigment`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const list = data.data || [];
        setRentAssignments(list);
      } else {
        console.warn('Failed to fetch rent assignments - endpoint might not exist yet');
      }
    } catch (error) {
      console.error('Error fetching rent assignments:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchRentAssignmentDetails = async (id) => {
    setDetailsLoading(true);
    setSelectedAssignment(null);
    setIsDetailsDrawerOpen(true);

    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${apiUrl}/api/rentAssigment/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        const details = data.rentAssigmentDetail || data;
        setSelectedAssignment(Array.isArray(details) ? details[0] : details);
      } else {
        showSnackbar('Nie udało się pobrać szczegółów umowy.', 'error');
        setIsDetailsDrawerOpen(false);
      }
    } catch (error) {
       console.error('Error fetching details:', error);
       showSnackbar('Błąd połączenia z serwerem.', 'error');
       setIsDetailsDrawerOpen(false);
    } finally {
        setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchRentAssignments();
  }, []);

  const handleAddAssignment = async (formData) => {
    setIsLoading(true);
    setErrors({});
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${apiUrl}/api/rentAssigment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showSnackbar('Umowa najmu została dodana pomyślnie.', 'success');
        setIsDrawerOpen(false);
        fetchRentAssignments();
      } else {
        if (data.error && typeof data.error === 'object') {
            setErrors(data.error);
            showSnackbar(data.message || 'Sprawdź formularz pod kątem błędów.', 'error');
        } else {
            showSnackbar(data.message || data.error || 'Błąd podczas dodawania umowy.', 'error');
        }
      }
    } catch (error) {
      console.error('Add rent assignment error:', error);
      showSnackbar('Błąd połączenia z serwerem.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditingAssignment(selectedAssignment);
    setIsDetailsDrawerOpen(false);
    setIsEditDrawerOpen(true);
  };

  const handleEditAssignment = async (formData) => {
    if (!editingAssignment) return;

    setIsLoading(true);
    setErrors({});
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${apiUrl}/api/rentAssigment/${editingAssignment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showSnackbar(data.message || 'Umowa została zaktualizowana.', 'success');
        setIsEditDrawerOpen(false);
        setEditingAssignment(null);
        fetchRentAssignments();
      } else {
        if (data.error && typeof data.error === 'object') {
            setErrors(data.error);
            showSnackbar(data.message || 'Sprawdź formularz pod kątem błędów.', 'error');
        } else {
            showSnackbar(data.message || data.error || 'Błąd podczas zapisywania umowy.', 'error');
        }
      }
    } catch (error) {
      console.error('Edit rent assignment error:', error);
      showSnackbar('Błąd połączenia z serwerem.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (assignment) => {
    fetchRentAssignmentDetails(assignment.id);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmClick = () => {
    setIsConfirmModalOpen(true);
  };

  const confirmConfirmation = async () => {
    if (!selectedAssignment) return;

    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${apiUrl}/api/rentAssigment/${selectedAssignment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ confirmed: true })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showSnackbar('Umowa została potwierdzona.', 'success');
        setIsConfirmModalOpen(false);
        setIsDetailsDrawerOpen(false);
        setSelectedAssignment(null);
        fetchRentAssignments();
      } else {
        showSnackbar(data.message || 'Nie udało się potwierdzić umowy.', 'error');
      }
    } catch (error) {
      console.error('Confirm rent assignment error:', error);
      showSnackbar('Błąd połączenia z serwerem.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedAssignment) return;

    setIsLoading(true); // Reuse isLoading or create new state for delete loading
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${apiUrl}/api/rentAssigment/${selectedAssignment.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });
      
      if (response.ok) {
        showSnackbar('Umowa najmu została usunięta.', 'success');
        setIsDeleteModalOpen(false);
        setIsDetailsDrawerOpen(false);
        setSelectedAssignment(null);
        fetchRentAssignments();
      } else {
        showSnackbar('Nie udało się usunąć umowy.', 'error');
      }
    } catch (error) {
      console.error('Delete rent assignment error:', error);
      showSnackbar('Błąd połączenia z serwerem.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pl-PL');
  };

  return (
    <div>
      <div className="page-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-header" style={{ marginBottom: 0 }}>Umowy Najmu</h1>
        <div style={{ width: '200px' }}>
          <Button onClick={() => setIsDrawerOpen(true)}>
            + Dodaj umowę
          </Button>
        </div>
      </div>
      
      {isFetching ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Ładowanie...</div>
      ) : rentAssignments.length > 0 ? (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nazwa obiektu</th>
                <th>{localStorage.getItem('role') === 'owner' ? 'Najemca' : 'Właściciel'}</th>
                <th>Data rozpoczęcia</th>
                <th>Data zakończenia</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rentAssignments.map((assignment, index) => (
                <tr 
                    key={assignment.id || index}
                    onClick={() => handleRowClick(assignment)}
                    style={{ cursor: 'pointer' }}
                    className="clickable-row"
                >
                  <td>{assignment.object_name || 'Brak nazwy'}</td>
                  <td>
                    {localStorage.getItem('role') === 'owner' 
                        ? (
                            (assignment.renter_first_name || assignment.renter_last_name)
                                ? `${assignment.renter_first_name || ''} ${assignment.renter_last_name || ''}`
                                : (assignment.renter_email || '-')
                          )
                        : (
                            (assignment.owner_first_name || assignment.owner_last_name)
                                ? `${assignment.owner_first_name || ''} ${assignment.owner_last_name || ''}`
                                : (assignment.owner_email || '-')
                          )
                    }
                  </td>
                  <td>{formatDate(assignment.start_date)}</td>
                  <td>{formatDate(assignment.end_date)}</td>
                  <td>
                    <span className={`status-badge ${assignment.confirmed ? 'success' : 'warning'}`}>
                      {assignment.confirmed ? 'Potwierdzona' : 'Niepotwierdzona'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p className="page-text">Nie masz jeszcze żadnych umów najmu.</p>
          <p className="page-text" style={{ fontSize: '0.9rem' }}>Kliknij przycisk powyżej, aby dodać pierwszą.</p>
        </div>
      )}

      {/* Add Drawer */}
      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        title="Dodaj nową umowę najmu"
      >
        <AddRentAssignmentForm 
          onSubmit={handleAddAssignment} 
          onCancel={() => setIsDrawerOpen(false)} 
          isLoading={isLoading}
          errors={errors}
        />
      </Drawer>

      {/* Edit Drawer */}
      <Drawer 
        isOpen={isEditDrawerOpen} 
        onClose={() => {
          setIsEditDrawerOpen(false);
          setEditingAssignment(null);
        }} 
        title="Edytuj umowę najmu"
      >
        <EditRentAssignmentForm 
          onSubmit={handleEditAssignment} 
          onCancel={() => {
            setIsEditDrawerOpen(false);
            setEditingAssignment(null);
          }} 
          isLoading={isLoading}
          errors={errors}
          assignmentData={editingAssignment}
        />
      </Drawer>

      {/* Details Drawer */}
      <Drawer
        isOpen={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        title="Szczegóły umowy"
      >
        <RentAssignmentDetails
            data={selectedAssignment}
            isLoading={detailsLoading}
            onEdit={handleEditClick}
            onConfirm={handleConfirmClick}
            onDelete={handleDeleteClick}
        />
      </Drawer>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Usuń umowę"
        message="Czy na pewno chcesz usunąć tę umowę najmu? Tej operacji nie można cofnąć."
        confirmText="Usuń"
        isDestructive={true}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmConfirmation}
        title="Potwierdź umowę"
        message="Czy na pewno chcesz potwierdzić tę umowę najmu?"
        confirmText="Potwierdź"
        isDestructive={false}
      />
    </div>
  );
};

export default RentAssignment;
