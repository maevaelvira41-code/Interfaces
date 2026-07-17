import React, { useState } from 'react';
import {
  ArrowLeft, ShieldCheck, FileText, GraduationCap, CheckCircle,
  XCircle, Clock, AlertCircle, User, Phone, Mail, Search,
} from 'lucide-react';

// pendingVerifications: [{ id, prenom, nom, email, telephone, idDocuments, trainingInstitution,
//   trainingCertificate, attestationNumber, trainingYear, submittedAt, status }]
export default function VendorVerificationAdmin({ pendingVerifications = [], onApprove, onReject, onBack }) {
  const [selectedId, setSelectedId] = useState(pendingVerifications[0]?.id ?? null);
  const [search, setSearch] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);

  const filtered = pendingVerifications.filter(v => {
    const q = search.toLowerCase();
    return (
      v.prenom?.toLowerCase().includes(q) ||
      v.nom?.toLowerCase().includes(q) ||
      v.email?.toLowerCase().includes(q)
    );
  });

  const selected = pendingVerifications.find(v => v.id === selectedId) || filtered[0];

  const statusBadge = (status) => {
    if (status === 'approved') return { label: '✅ Approuvé', bg: '#e9f5ee', color: '#2d6a4f' };
    if (status === 'rejected') return { label: '❌ Rejeté', bg: '#fdecea', color: '#c0392b' };
    return { label: '⏳ En attente', bg: '#fff8e8', color: '#f5b041' };
  };

  const handleApprove = () => {
    if (!selected) return;
    onApprove(selected.id);
    setShowRejectBox(false);
  };

  const handleReject = () => {
    if (!selected) return;
    onReject(selected.id, rejectReason);
    setRejectReason('');
    setShowRejectBox(false);
  };

  const pendingCount = pendingVerifications.filter(v => v.status === 'pending').length;

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>

        <div style={styles.header}>
          <button style={styles.backBtn} onClick={onBack}>
            <ArrowLeft size={18} /> Retour
          </button>
          <div style={styles.headerTitleRow}>
            <div style={styles.headerBadge}><ShieldCheck size={24} color="#ffffff" /></div>
            <div>
              <h1 style={styles.title}>Vérification des vendeurs</h1>
              <p style={styles.subtitle}>
                {pendingCount} demande{pendingCount !== 1 ? 's' : ''} en attente de validation
              </p>
            </div>
          </div>
        </div>

        <div style={styles.grid}>

          {/* Liste des demandes */}
          <div style={styles.listPanel}>
            <div style={styles.searchWrap}>
              <Search size={16} color="#adb5bd" />
              <input
                type="text"
                placeholder="Rechercher un vendeur..."
                style={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={styles.list}>
              {filtered.length === 0 && (
                <p style={styles.emptyText}>Aucune demande trouvée.</p>
              )}
              {filtered.map((v) => {
                const badge = statusBadge(v.status);
                const isSelected = selected?.id === v.id;
                return (
                  <div
                    key={v.id}
                    style={{
                      ...styles.listItem,
                      ...(isSelected ? styles.listItemActive : {}),
                    }}
                    onClick={() => { setSelectedId(v.id); setShowRejectBox(false); }}
                  >
                    <div style={styles.listItemAvatar}>
                      {v.prenom?.[0]?.toUpperCase()}{v.nom?.[0]?.toUpperCase()}
                    </div>
                    <div style={styles.listItemInfo}>
                      <span style={styles.listItemName}>{v.prenom} {v.nom}</span>
                      <span style={styles.listItemEmail}>{v.email}</span>
                    </div>
                    <span style={{ ...styles.miniBadge, backgroundColor: badge.bg, color: badge.color }}>
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Détail de la demande */}
          <div style={styles.detailPanel}>
            {!selected ? (
              <div style={styles.emptyState}>
                <ShieldCheck size={48} color="#dee2e6" />
                <p>Sélectionnez une demande pour voir les détails</p>
              </div>
            ) : (
              <>
                <div style={styles.detailHeader}>
                  <div style={styles.detailAvatar}>
                    {selected.prenom?.[0]?.toUpperCase()}{selected.nom?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h2 style={styles.detailName}>{selected.prenom} {selected.nom}</h2>
                    <span
                      style={{
                        ...styles.statusPill,
                        backgroundColor: statusBadge(selected.status).bg,
                        color: statusBadge(selected.status).color,
                      }}
                    >
                      {statusBadge(selected.status).label}
                    </span>
                  </div>
                </div>

                <div style={styles.contactRow}>
                  <div style={styles.contactItem}><Mail size={14} color="#6c757d" /> {selected.email}</div>
                  <div style={styles.contactItem}><Phone size={14} color="#6c757d" /> {selected.telephone}</div>
                </div>

                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}><FileText size={16} color="#2d6a4f" /> Pièce d'identité</h3>
                  {selected.idDocuments?.length > 0 ? (
                    <div style={styles.fileList}>
                      {selected.idDocuments.map((doc, i) => (
                        <div key={i} style={styles.fileItem}>
                          <FileText size={14} color="#2d6a4f" /> {doc.name}
                          <span style={styles.fileSize}>{doc.size}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={styles.missing}>Aucun document fourni</p>
                  )}
                </div>

                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}><GraduationCap size={16} color="#2d6a4f" /> Formation agropastorale</h3>
                  <div style={styles.infoGrid}>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Établissement</span>
                      <span style={styles.infoValue}>{selected.trainingInstitution || '—'}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>N° d'attestation</span>
                      <span style={styles.infoValue}>{selected.attestationNumber || '—'}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Année</span>
                      <span style={styles.infoValue}>{selected.trainingYear || '—'}</span>
                    </div>
                  </div>
                  {selected.trainingCertificate?.length > 0 ? (
                    <div style={styles.fileList}>
                      {selected.trainingCertificate.map((doc, i) => (
                        <div key={i} style={styles.fileItem}>
                          <GraduationCap size={14} color="#2d6a4f" /> {doc.name}
                          <span style={styles.fileSize}>{doc.size}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={styles.missing}>Aucune attestation fournie</p>
                  )}
                </div>

                <div style={styles.tipBox}>
                  <AlertCircle size={16} color="#e07a5f" />
                  <span style={styles.tipText}>
                    Vérifiez que le numéro d'attestation correspond bien à l'établissement déclaré
                    avant d'approuver. En cas de doute, rejetez avec un motif clair.
                  </span>
                </div>

                {selected.status === 'pending' && (
                  <>
                    {!showRejectBox ? (
                      <div style={styles.actionRow}>
                        <button style={styles.rejectBtn} onClick={() => setShowRejectBox(true)}>
                          <XCircle size={18} /> Rejeter
                        </button>
                        <button style={styles.approveBtn} onClick={handleApprove}>
                          <CheckCircle size={18} /> Approuver
                        </button>
                      </div>
                    ) : (
                      <div style={styles.rejectBox}>
                        <label style={styles.label}>Motif du rejet</label>
                        <textarea
                          style={styles.textarea}
                          rows="3"
                          placeholder="Ex: document illisible, numéro d'attestation invalide..."
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div style={styles.actionRow}>
                          <button style={styles.backBtnSmall} onClick={() => setShowRejectBox(false)}>Annuler</button>
                          <button style={styles.rejectConfirmBtn} onClick={handleReject}>
                            Confirmer le rejet
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {selected.status !== 'pending' && (
                  <div style={styles.decidedBox}>
                    <Clock size={16} color="#6c757d" />
                    <span>Cette demande a déjà été traitée.</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 80px' },

  header: { marginBottom: '28px' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#212529', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginBottom: '16px', padding: 0 },
  headerTitleRow: { display: 'flex', alignItems: 'center', gap: '14px' },
  headerBadge: { width: '48px', height: '48px', backgroundColor: '#2d6a4f', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  title: { fontSize: '22px', fontWeight: '900', color: '#1b4d3e', margin: 0 },
  subtitle: { fontSize: '13.5px', color: '#6c757d', margin: '2px 0 0 0', fontWeight: '600' },

  grid: { display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', alignItems: 'start' },

  // Liste
  listPanel: { backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e9ecef', padding: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.03)' },
  searchWrap: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: '#f8f9fa', borderRadius: '12px', border: '1px solid #e9ecef', marginBottom: '12px' },
  searchInput: { flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '13px' },
  list: { display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '620px', overflowY: 'auto' },
  emptyText: { fontSize: '13px', color: '#adb5bd', textAlign: 'center', padding: '24px 0' },
  listItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '12px', cursor: 'pointer', border: '1px solid transparent' },
  listItemActive: { backgroundColor: '#e9f5ee', border: '1px solid #b7e4c7' },
  listItemAvatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#2d6a4f', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', flexShrink: 0 },
  listItemInfo: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  listItemName: { fontSize: '13px', fontWeight: '700', color: '#212529', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  listItemEmail: { fontSize: '11.5px', color: '#adb5bd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  miniBadge: { fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '20px', whiteSpace: 'nowrap' },

  // Détail
  detailPanel: { backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e9ecef', padding: '28px', boxShadow: '0 8px 24px rgba(0,0,0,0.03)', minHeight: '400px' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: '#adb5bd', fontSize: '14px', padding: '80px 0' },

  detailHeader: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' },
  detailAvatar: { width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#2d6a4f', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '800', flexShrink: 0 },
  detailName: { fontSize: '19px', fontWeight: '900', color: '#212529', margin: '0 0 6px 0' },
  statusPill: { fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px' },

  contactRow: { display: 'flex', gap: '20px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f1f3f5' },
  contactItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#495057', fontWeight: '600' },

  section: { marginBottom: '20px' },
  sectionTitle: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '800', color: '#212529', margin: '0 0 10px 0' },
  fileList: { display: 'flex', flexDirection: 'column', gap: '6px' },
  fileItem: { display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', backgroundColor: '#f8f9fa', borderRadius: '10px', fontSize: '12.5px', color: '#212529', fontWeight: '600', border: '1px solid #e9ecef' },
  fileSize: { marginLeft: 'auto', fontSize: '11px', color: '#adb5bd', fontWeight: '500' },
  missing: { fontSize: '12.5px', color: '#e07a5f', fontWeight: '600', fontStyle: 'italic' },

  infoGrid: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #f1f3f5' },
  infoLabel: { fontSize: '12.5px', color: '#6c757d', fontWeight: '600' },
  infoValue: { fontSize: '12.5px', color: '#212529', fontWeight: '700', textAlign: 'right' },

  tipBox: { display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px', backgroundColor: '#fff5f2', borderRadius: '12px', border: '1px solid #f5d4c8', marginBottom: '20px' },
  tipText: { fontSize: '12px', color: '#495057', lineHeight: '1.5' },

  actionRow: { display: 'flex', gap: '12px' },
  approveBtn: { flex: 1, padding: '14px', backgroundColor: '#2d6a4f', color: '#ffffff', border: 'none', borderRadius: '14px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  rejectBtn: { flex: 1, padding: '14px', backgroundColor: '#fdecea', color: '#c0392b', border: '1px solid #f5c6c0', borderRadius: '14px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  rejectConfirmBtn: { flex: 2, padding: '14px', backgroundColor: '#c0392b', color: '#ffffff', border: 'none', borderRadius: '14px', fontSize: '14px', fontWeight: '800', cursor: 'pointer' },
  backBtnSmall: { flex: 1, padding: '14px', backgroundColor: '#f1f3f5', color: '#495057', border: 'none', borderRadius: '14px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },

  rejectBox: { display: 'flex', flexDirection: 'column', gap: '10px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#343a40' },
  textarea: { width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #dee2e6', fontSize: '13px', backgroundColor: '#f8f9fa', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' },

  decidedBox: { display: 'flex', alignItems: 'center', gap: '8px', padding: '14px', backgroundColor: '#f8f9fa', borderRadius: '12px', fontSize: '13px', color: '#6c757d', fontWeight: '600' },
};