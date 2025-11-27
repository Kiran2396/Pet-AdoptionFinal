import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";

function ShelterDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("pets");
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [pets, setPets] = useState([]);

  const token = localStorage.getItem("token");

  const [newPet, setNewPet] = useState({
    name: "",
    breed: "",
    age: "",
    healthInfo: "",
    imageUrl: "",
  });

  // ----------------------------
  // 🔹 1) Load pets from backend
  // ----------------------------
  useEffect(() => {
    fetch("http://localhost:8082/api/pets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPets(data))
      .catch((err) => console.error("Error loading pets:", err));
  }, []);

  // ----------------------------
  // 🔹 2) Add Pet → Backend
  // ----------------------------
  const handleAddPet = (e) => {
    e.preventDefault();

    fetch("http://localhost:8082/api/pets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newPet),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add pet");
        return res.json();
      })
      .then((savedPet) => {
        setPets([...pets, savedPet]);
        setShowAddPetForm(false);

        // reset form
        setNewPet({
          name: "",
          breed: "",
          age: "",
          healthInfo: "",
          imageUrl: "",
        });

        alert("Pet added successfully!");
      })
      .catch((err) => alert("Error: " + err.message));
  };

  // ----------------------------
  // 🔹 3) Delete pet from backend
  // ----------------------------
  const handleDeletePet = (id) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;

    fetch(`http://localhost:8082/api/pets/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete pet");
        setPets(pets.filter((p) => p.id !== id));
      })
      .catch((err) => alert("Error deleting pet: " + err.message));
  };

  // Dummy Adoption Requests for now
  const adoptionRequests = [];

  return (
    <div className={styles.dashboard}>
      <div className="container">
        <div className={styles.dashboardHeader}>
          <h1>Shelter Dashboard</h1>
          <p>Manage your pets and adoption requests</p>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{pets.length}</div>
            <div className={styles.statLabel}>Total Pets</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>
              {pets.filter((p) => p.status !== "adopted").length}
            </div>
            <div className={styles.statLabel}>Available</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{adoptionRequests.length}</div>
            <div className={styles.statLabel}>Pending Requests</div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.dashboardNav}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "pets" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("pets")}
          >
            My Pets ({pets.length})
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "requests" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("requests")}
          >
            Adoption Requests ({adoptionRequests.length})
          </button>
        </div>

        {/* PETS SECTION */}
        {activeTab === "pets" && (
          <div className={styles.petsManagement}>
            <div className={styles.sectionHeader}>
              <h2>Manage Pets</h2>
              <button
                onClick={() => setShowAddPetForm(true)}
                className="btn btn-primary"
              >
                Add New Pet
              </button>
            </div>

            {/* Add Pet Modal */}
            {showAddPetForm && (
              <div className={styles.modal}>
                <div className={styles.modalContent}>
                  <div className={styles.modalHeader}>
                    <h3>Add New Pet</h3>
                    <button
                      onClick={() => setShowAddPetForm(false)}
                      className={styles.closeButton}
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={handleAddPet} className={styles.petForm}>
                    <div className="form-group">
                      <label>Pet Name</label>
                      <input
                        type="text"
                        value={newPet.name}
                        onChange={(e) =>
                          setNewPet({ ...newPet, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Breed</label>
                      <input
                        type="text"
                        value={newPet.breed}
                        onChange={(e) =>
                          setNewPet({ ...newPet, breed: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Age</label>
                      <input
                        type="number"
                        value={newPet.age}
                        onChange={(e) =>
                          setNewPet({ ...newPet, age: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Health Info</label>
                      <input
                        type="text"
                        value={newPet.healthInfo}
                        onChange={(e) =>
                          setNewPet({ ...newPet, healthInfo: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Image URL</label>
                      <input
                        type="url"
                        value={newPet.imageUrl}
                        onChange={(e) =>
                          setNewPet({ ...newPet, imageUrl: e.target.value })
                        }
                      />
                    </div>

                    <div className={styles.formActions}>
                      <button type="submit" className="btn btn-primary">
                        Add Pet
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowAddPetForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Pets Grid */}
            <div className={styles.petsGrid}>
              {pets.map((pet) => (
                <div key={pet.id} className={styles.petCard}>
                  <img
                    src={
                      pet.imageUrl ||
                      "https://placehold.co/300x200?text=No+Image"
                    }
                    alt={pet.name}
                  />

                  <div className={styles.petInfo}>
                    <h3>{pet.name}</h3>
                    <p>Breed: {pet.breed}</p>
                    <p>Age: {pet.age}</p>
                    <p>Health: {pet.healthInfo}</p>
                  </div>

                  <div className={styles.petActions}>
                    <button
                      onClick={() => handleDeletePet(pet.id)}
                      className="btn btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADOPTION REQUESTS */}
        {activeTab === "requests" && (
          <div className={styles.requestsSection}>
            <h2>Adoption Requests</h2>

            {adoptionRequests.length === 0 && (
              <p>No adoption requests yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShelterDashboard;
