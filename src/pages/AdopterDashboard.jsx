import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';

function AdopterDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('browse');

  const [filters, setFilters] = useState({
    search: ""
  });

  // -------------------------------
  // 🔥 Load pets from backend
  // -------------------------------
  const [pets, setPets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8082/api/pets")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched pets:", data);

        const formatted = data.map(p => ({
          id: p.id,
          name: p.name,
          species: "pet",
          breed: p.breed,
          age: p.age + " years",
          location: "Unknown",
          health: p.healthInfo,
          status: "available",
          image: p.imageUrl,
          description: "Lovely pet available for adoption.",
          shelter: p.shelter?.name || "Unknown Shelter"
        }));

        setPets(formatted);
      })
      .catch(err => console.error("Error fetching pets:", err));
  }, []);

  // keep existing mock applications
  const [applications] = useState([
    {
      id: 1,
      petId: 1,
      petName: 'Buddy',
      shelter: 'Happy Paws Shelter',
      status: 'pending',
      submittedDate: '2025-01-10',
      message: 'I would love to adopt Buddy for my family.'
    },
    {
      id: 2,
      petId: 2,
      petName: 'Whiskers',
      shelter: 'Feline Friends Rescue',
      status: 'approved',
      submittedDate: '2025-01-08',
      message: 'Looking forward to giving Whiskers a loving home.'
    }
  ]);

  // ------------------------------------
  // 🔥 New search-based filter
  // ------------------------------------
  const filteredPets = pets.filter(pet => {
    if (!filters.search.trim()) return true;

    const text = filters.search.toLowerCase();
    return (
      pet.name.toLowerCase().includes(text) ||
      pet.breed.toLowerCase().includes(text) ||
      pet.species.toLowerCase().includes(text) ||
      pet.health.toLowerCase().includes(text) ||
      pet.shelter.toLowerCase().includes(text)
    );
  });

  const handleAdopt = (petId) => {
    alert(`Adoption application submitted for pet ID: ${petId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'var(--warning-color)';
      case 'approved': return 'var(--success-color)';
      case 'rejected': return 'var(--error-color)';
      default: return 'var(--neutral-500)';
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className="container">
        <div className={styles.dashboardHeader}>
          <h1>Welcome back, {user.name}!</h1>
          <p>Find your perfect companion and track your adoption journey</p>
        </div>

        {/* Tabs */}
        <div className={styles.dashboardNav}>
          <button
            className={`${styles.tabButton} ${activeTab === 'browse' ? styles.active : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            Browse Pets
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'applications' ? styles.active : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            My Applications ({applications.length})
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'favorites' ? styles.active : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
        </div>

        {/* -------------------- */}
        {/* 🔥 Updated Browse Tab */}
        {/* -------------------- */}
        {activeTab === 'browse' && (
          <div className={styles.browseSection}>

            {/* 🌟 NEW Modern Search Bar */}
            <div className={styles.searchBarWrapper}>
              <input
                type="text"
                className={styles.searchBar}
                placeholder="Search pets by name, breed, species, health, or shelter..."
                value={filters.search}
                onChange={e => setFilters({ search: e.target.value })}
              />
            </div>

            {/* Pets Grid */}
            <div className={styles.petsGrid}>
              {filteredPets.map(pet => (
                <div key={pet.id} className={styles.petCard}>
                  <div className={styles.petImage}>
                    <img src={pet.image} alt={pet.name} />
                    <div className={styles.petStatus}>{pet.status}</div>
                  </div>
                  <div className={styles.petInfo}>
                    <h3>{pet.name}</h3>
                    <div className={styles.petDetails}>
                      <span className={styles.petDetail}>🐾 {pet.breed}</span>
                      <span className={styles.petDetail}>🎂 {pet.age}</span>
                      <span className={styles.petDetail}>📍 {pet.location}</span>
                      <span className={styles.petDetail}>❤️ {pet.health}</span>
                    </div>
                    <p className={styles.petDescription}>{pet.description}</p>
                    <div className={styles.shelterInfo}>
                      <small>Listed by: {pet.shelter}</small>
                    </div>
                  </div>

                  <div className={styles.petActions}>
                    <button
                      onClick={() => handleAdopt(pet.id)}
                      className="btn btn-primary"
                    >
                      Apply to Adopt
                    </button>
                    <button className="btn btn-secondary">
                      Add to Favorites
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className={styles.applicationsSection}>
            <h2>My Adoption Applications</h2>

            {applications.length === 0 ? (
              <div className={styles.emptyState}>
                <p>You haven't submitted any adoption applications yet.</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="btn btn-primary"
                >
                  Browse Pets
                </button>
              </div>
            ) : (
              <div className={styles.applicationsList}>
                {applications.map(application => (
                  <div key={application.id} className={styles.applicationCard}>
                    <div className={styles.applicationHeader}>
                      <h3>{application.petName}</h3>
                      <span
                        className={styles.applicationStatus}
                        style={{ color: getStatusColor(application.status) }}
                      >
                        {application.status.toUpperCase()}
                      </span>
                    </div>

                    <div className={styles.applicationDetails}>
                      <p><strong>Shelter:</strong> {application.shelter}</p>
                      <p><strong>Submitted:</strong> {application.submittedDate}</p>
                      <p><strong>Message:</strong> {application.message}</p>
                    </div>

                    <div className={styles.applicationActions}>
                      {application.status === 'approved' && (
                        <button className="btn btn-success">
                          Complete Adoption
                        </button>
                      )}
                      <button className="btn btn-secondary">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Favorites */}
        {activeTab === 'favorites' && (
          <div className={styles.favoritesSection}>
            <h2>My Favorite Pets</h2>
            <div className={styles.emptyState}>
              <p>You haven't added any pets to your favorites yet.</p>
              <button
                onClick={() => setActiveTab('browse')}
                className="btn btn-primary"
              >
                Browse Pets
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdopterDashboard;
