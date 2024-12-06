import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    TouchableWithoutFeedback,
} from 'react-native';
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const RequestBarter = ({ visible, onClose }) => {
    const [activeTab, setActiveTab] = useState('requests'); // 'requests' atau 'history'
    const [requests, setRequests] = useState([]);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (visible) {
            fetchRequests();
            fetchHistory();
        }
    }, [visible]);

    const fetchUserInfo = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                return userDoc.data();
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
        return { name: 'Unknown', telp: 'N/A' };
    };

    const fetchRequests = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'barterRequests'));
            const fetchedRequests = await Promise.all(
                querySnapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    const requesterInfo = await fetchUserInfo(data.requesterId);
                    const ownerInfo = await fetchUserInfo(data.ownerId);
    
                    return {
                        id: doc.id,
                        ...data, // Ambil semua data dari Firebase
                        requesterName: requesterInfo.name,
                        requesterPhone: requesterInfo.telp,
                        ownerName: ownerInfo.name,
                        ownerPhone: ownerInfo.telp,
                        exchangeQty: data.exchangeQty || 'N/A', // Jumlah barang ditawarkan
                        requesterQuantity: data.requesterQuantity || 'N/A', // Jumlah barang diminta
                    };
                })
            );
            const filteredRequests = fetchedRequests
                .filter((request) => !request.processed)
                .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
            setRequests(filteredRequests);
        } catch (error) {
            console.error('Error fetching barter requests:', error);
        }
    };
    
    const fetchHistory = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'barterHistory'));
            const fetchedHistory = await Promise.all(
                querySnapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    const requesterInfo = await fetchUserInfo(data.requesterId);
                    const ownerInfo = await fetchUserInfo(data.ownerId);
    
                    return {
                        id: doc.id,
                        ...data,
                        requesterName: requesterInfo.name,
                        requesterPhone: requesterInfo.telp,
                        ownerName: ownerInfo.name,
                        ownerPhone: ownerInfo.telp,
                        exchangeQty: data.exchangeQty || 'N/A', // Jumlah barang ditawarkan
                        requesterQuantity: data.requesterQuantity || 'N/A', // Jumlah barang diminta
                    };
                })
            );
            const filteredHistory = fetchedHistory.sort(
                (a, b) => b.timestamp.seconds - a.timestamp.seconds
            );
            setHistory(filteredHistory);
        } catch (error) {
            console.error('Error fetching barter history:', error);
        }
    };    

    const handleResponse = async (requestId, isAccepted, request) => {
        try {
            if (isAccepted) {
                // Tambahkan ke history dengan status 'accepted'
                await addDoc(collection(db, 'barterHistory'), {
                    ...request,
                    status: 'accepted',
                    timestamp: serverTimestamp(),
                });
    
                // Kurangi stok barang owner
                const ownerProductRef = doc(db, 'products', request.ownerProductId);
                const ownerProductDoc = await getDoc(ownerProductRef);
                if (ownerProductDoc.exists()) {
                    const ownerData = ownerProductDoc.data();
                    const currentOwnerQty = parseInt(ownerData.jumlah, 10) || 0; // Pastikan nilai angka
                    const requestQty = parseInt(request.requesterQuantity, 10) || 0; // Jumlah diminta
                    const updatedOwnerQty = currentOwnerQty - requestQty;
    
                    // Pastikan jumlah tidak negatif
                    await updateDoc(ownerProductRef, { jumlah: Math.max(0, updatedOwnerQty) });
                }
    
                // Kurangi stok barang requester
                const requesterProductRef = doc(db, 'products', request.requesterProductId);
                const requesterProductDoc = await getDoc(requesterProductRef);
                if (requesterProductDoc.exists()) {
                    const requesterData = requesterProductDoc.data();
                    const currentRequesterQty = parseInt(requesterData.jumlah, 10) || 0; // Pastikan nilai angka
                    const exchangeQty = parseInt(request.exchangeQty, 10) || 0; // Barang untuk ditukar
                    const updatedRequesterQty = currentRequesterQty - exchangeQty;
    
                    // Pastikan jumlah tidak negatif
                    await updateDoc(requesterProductRef, { jumlah: Math.max(0, updatedRequesterQty) });
                }
            } else {
                // Tambahkan ke history dengan status 'rejected'
                await addDoc(collection(db, 'barterHistory'), {
                    ...request,
                    status: 'rejected',
                    timestamp: serverTimestamp(),
                });
            }
    
            // Hapus permintaan dari database
            await deleteDoc(doc(db, 'barterRequests', requestId));
    
            // Refresh data
            fetchRequests();
            fetchHistory();
        } catch (error) {
            console.error('Error processing barter request:', error);
        }
    };    

    const renderRequests = ({ item }) => {
        const isOwner = item.ownerId === auth.currentUser.uid;
    
        return (
            <View style={styles.card}>
                <Text style={styles.cardTitle}>
                    {isOwner
                        ? `Permintaan dari ${item.requesterName} (${item.requesterPhone})`
                        : `Permintaan terkirim ke ${item.ownerName} (${item.ownerPhone})`}
                </Text>
                <Text style={styles.cardText}>Barang Anda: {item.ownerProductName}</Text>
                <Text style={styles.cardText}>
                    Jumlah Barang Anda: {item.exchangeQty || 'Tidak tersedia'}
                </Text>
                <Text style={styles.cardText}>
                    Jumlah Diminta: {item.requesterQuantity || 'Tidak tersedia'}
                </Text>
                <Text style={styles.cardText}>Barang Ditawarkan: {item.requesterProductName}</Text>
                <Text style={styles.cardText}>
                    Jumlah Ditawarkan: {item.exchangeQty || 'Tidak tersedia'}
                </Text>
                <Text style={styles.cardText}>
                    Tanggal: {new Date(item.timestamp.seconds * 1000).toLocaleString()}
                </Text>
                {isOwner ? (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.declineButton}
                            onPress={() => handleResponse(item.id, false, item)}
                        >
                            <Text style={styles.buttonText}>Tolak</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.acceptButton}
                            onPress={() => handleResponse(item.id, true, item)}
                        >
                            <Text style={[styles.buttonText, { color: 'white' }]}>Terima</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text style={styles.statusText}>Permintaan telah dikirim</Text>
                )}
            </View>
        );
    };    
    
    const renderHistory = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>
                Barter {item.status === 'accepted' ? 'Berhasil' : 'Ditolak'} dengan{' '}
                {item.ownerId === auth.currentUser.uid ? item.requesterName : item.ownerName} (
                {item.ownerId === auth.currentUser.uid ? item.requesterPhone : item.ownerPhone})
            </Text>
            <Text style={styles.cardText}>Barang Anda: {item.ownerProductName}</Text>
            <Text style={styles.cardText}>
                Jumlah Barang Anda: {item.exchangeQty || 'Tidak tersedia'}
            </Text>
            <Text style={styles.cardText}>Barang Barter: {item.requesterProductName}</Text>
            <Text style={styles.cardText}>
                Jumlah Diminta: {item.requesterQuantity || 'Tidak tersedia'}
            </Text>
            <Text style={styles.cardText}>
                Tanggal: {new Date(item.timestamp.seconds * 1000).toLocaleString()}
            </Text>
        </View>
    );    

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.container}>
                            <View style={styles.tabContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.tabButton,
                                        activeTab === 'requests' && styles.activeTab,
                                    ]}
                                    onPress={() => setActiveTab('requests')}
                                >
                                    <Text
                                        style={[
                                            styles.tabText,
                                            activeTab === 'requests' && styles.activeTabText,
                                        ]}
                                    >
                                        Permintaan
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.tabButton,
                                        activeTab === 'history' && styles.activeTab,
                                    ]}
                                    onPress={() => setActiveTab('history')}
                                >
                                    <Text
                                        style={[
                                            styles.tabText,
                                            activeTab === 'history' && styles.activeTabText,
                                        ]}
                                    >
                                        Riwayat
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={activeTab === 'requests' ? requests : history}
                                renderItem={
                                    activeTab === 'requests' ? renderRequests : renderHistory
                                }
                                keyExtractor={(item) => item.id}
                                ListEmptyComponent={
                                    <Text style={styles.emptyText}>
                                        Belum ada{' '}
                                        {activeTab === 'requests' ? 'permintaan' : 'riwayat'} barter.
                                    </Text>
                                }
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: 'white',
        width: '90%',
        height: '80%',
        borderRadius: 10,
        padding: 16,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#697565',
    },
    tabText: {
        color: 'gray',
        fontWeight: 'bold',
    },
    activeTabText: {
        color: '#697565',
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardText: {
        fontSize: 14,
        color: 'gray',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 16,
        justifyContent: 'space-between',
    },
    acceptButton: {
        backgroundColor: '#697565',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    declineButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'gray',
    },
    statusText: {
        marginTop: 10,
        fontSize: 14,
        color: 'gray',
        fontStyle: 'italic',
    },
    emptyText: {
        textAlign: 'center',
        color: 'gray',
        marginTop: 16,
    },
});

export default RequestBarter;