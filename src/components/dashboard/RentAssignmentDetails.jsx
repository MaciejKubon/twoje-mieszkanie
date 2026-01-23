import Button from "../ui/Button";

const RentAssignmentDetails = ({
  data,
  isLoading,
  onEdit,
  onConfirm,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          color: "var(--text-muted)",
        }}
      >
        Ładowanie szczegółów...
      </div>
    );
  }

  if (!data) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          color: "var(--text-muted)",
        }}
      >
        Brak danych umowy.
      </div>
    );
  }

  const userRole = localStorage.getItem("role");

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pl-PL");
  };

  const DetailItem = ({ label, value }) => (
    <div className="detail-item">
      <div className="detail-item-label">{label}</div>
      <div className="detail-item-value">{value || "-"}</div>
    </div>
  );

  return (
    <div className="object-details">
      <div className="detail-header">
        <h2 className="detail-title">
          {data.object_in_rent_assigment?.name ||
            data.object_name ||
            "Umowa najmu"}
        </h2>
        <span
          className={`status-badge ${data.confirmed ? "success" : "warning"}`}
        >
          {data.confirmed ? "Potwierdzona" : "Niepotwierdzona"}
        </span>
      </div>

      <div className="detail-grid-full">
        {userRole === "owner" ? (
          <>
            <DetailItem
              label="Najemca"
              value={
                data.renter
                  ? `${data.renter.first_name} ${data.renter.last_name}`
                  : `${data.renter_first_name || ""} ${data.renter_last_name || ""}`.trim() ||
                    data.renter_email
              }
            />
            <DetailItem
              label="Email najemcy"
              value={data.renter?.email || data.renter_email}
            />
          </>
        ) : (
          <>
            <DetailItem
              label="Właściciel"
              value={
                data.object_in_rent_assigment?.owner
                  ? `${data.object_in_rent_assigment.owner.first_name} ${data.object_in_rent_assigment.owner.last_name}`
                  : data.owner_first_name
                    ? `${data.owner_first_name} ${data.owner_last_name}`
                    : "-"
              }
            />
            <DetailItem
              label="Email właściciela"
              value={
                data.object_in_rent_assigment?.owner?.email ||
                data.owner_email ||
                "-"
              }
            />
          </>
        )}
      </div>

      <div className="section-divider"></div>
      <h3 className="section-title">Szczegóły obiektu</h3>

      {data.object_in_rent_assigment && (
        <div className="detail-grid">
          <DetailItem
            label="Miasto"
            value={data.object_in_rent_assigment.city}
          />
          <DetailItem
            label="Ulica"
            value={data.object_in_rent_assigment.street}
          />
          <DetailItem
            label="Nr budynku"
            value={data.object_in_rent_assigment.house_number}
          />
          <DetailItem
            label="Nr lokalu"
            value={data.object_in_rent_assigment.apartment_number}
          />
        </div>
      )}

      <div className="section-divider"></div>

      <div className="detail-grid">
        <DetailItem
          label="Data rozpoczęcia"
          value={formatDate(data.start_date)}
        />
        <DetailItem
          label="Data zakończenia"
          value={formatDate(data.end_date)}
        />
      </div>

      {userRole === "owner" && (
        <div className="detail-actions">
          <Button variant="outline" onClick={onEdit}>
            Edytuj umowę
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Usuń umowę
          </Button>
        </div>
      )}

      {!data.confirmed && userRole !== "owner" && (
        <div style={{ marginTop: "1rem" }}>
          <Button
            variant="primary"
            onClick={onConfirm}
            style={{ width: "100%" }}
          >
            Potwierdź umowę
          </Button>
        </div>
      )}
    </div>
  );
};

export default RentAssignmentDetails;
