import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
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
import { Image } from 'react-native';

const RequestBarter = ({ visible, onClose }) => {
    const [activeTab, setActiveTab] = useState('requests');
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
                    ...data,
                    requesterName: requesterInfo.name,
                    requesterPhone: requesterInfo.telp,
                    ownerName: ownerInfo.name,
                    ownerPhone: ownerInfo.telp,
                    exchangeQty: data.exchangeQty || 'N/A',
                    requesterQuantity: data.requesterQuantity || 'N/A',
                };
            })
        );

        const filteredRequests = fetchedRequests
            .filter(
                (item) =>
                    item.requesterId === auth.currentUser.uid ||
                    item.ownerId === auth.currentUser.uid 
            )
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
                    exchangeQty: data.exchangeQty || 'N/A',
                    requesterQuantity: data.requesterQuantity || 'N/A',
                };
            })
        );

        const filteredHistory = fetchedHistory
            .filter(
                (item) =>
                    item.requesterId === auth.currentUser.uid ||
                    item.ownerId === auth.currentUser.uid
            )
            .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
        setHistory(filteredHistory);
    } catch (error) {
        console.error('Error fetching barter history:', error);
    }
};

    const handleResponse = async (requestId, isAccepted, request) => {
        try {
            if (isAccepted) {
                await addDoc(collection(db, 'barterHistory'), {
                    ...request,
                    status: 'accepted',
                    timestamp: serverTimestamp(),
                });
    
                const ownerProductRef = doc(db, 'products', request.ownerProductId);
                const ownerProductDoc = await getDoc(ownerProductRef);
                if (ownerProductDoc.exists()) {
                    const ownerData = ownerProductDoc.data();
                    const currentOwnerQty = parseInt(ownerData.jumlah, 10) || 0;
                    const requestQty = parseInt(request.requesterQuantity, 10) || 0;
                    const updatedOwnerQty = currentOwnerQty - requestQty;
    
                    await updateDoc(ownerProductRef, { jumlah: Math.max(0, updatedOwnerQty) });
                }
    
                const requesterProductRef = doc(db, 'products', request.requesterProductId);
                const requesterProductDoc = await getDoc(requesterProductRef);
                if (requesterProductDoc.exists()) {
                    const requesterData = requesterProductDoc.data();
                    const currentRequesterQty = parseInt (requesterData.jumlah, 10) || 0;
                    const exchangeQty = parseInt(request.exchangeQty, 10) || 0;
                    const updatedRequesterQty = currentRequesterQty - exchangeQty;

                    await updateDoc(requesterProductRef, { jumlah: Math.max(0, updatedRequesterQty) });
                }
            } else {
                await addDoc(collection(db, 'barterHistory'), {
                    ...request,
                    status: 'rejected',
                    timestamp: serverTimestamp(),
                });
            }

            await deleteDoc(doc(db, 'barterRequests', requestId));

            fetchRequests();
            fetchHistory();
        } catch (error) {
            console.error('Error processing barter request:', error);
        }
    };

    const renderRequests = ({ item }) => {
        const isOwner = item.ownerId === auth.currentUser .uid;

        return (
            <View className="bg-gray-100 p-4 rounded-lg mb-2">
                <View className="flex flex-row justify-between items-center">
                    <View className="flex-1">
                        <Text className="text-lg font-bold">
                            {isOwner
                                ? `Permintaan dari ${item.requesterName} (${item.requesterPhone})`
                                : `Permintaan terkirim ke ${item.ownerName} (${item.ownerPhone})`}
                        </Text>
                        <Text className="text-gray-600">Barang Diminta: {item.ownerProductName}</Text>
                        <Text className="text-gray-600">
                            Jumlah Diminta: {item.requesterQuantity || 'Tidak tersedia'}
                        </Text>
                        <Text className="text-gray-600">Barang Ditawarkan: {item.requesterProductName}</Text>
                        <Text className="text-gray-600">
                            Jumlah Ditawarkan: {item.exchangeQty || 'Tidak tersedia'}
                        </Text>
                        <Text className="text-gray-600">
                            Tanggal: {new Date(item.timestamp.seconds * 1000).toLocaleString()}
                        </Text>
                    </View>
                    <View className="justify-center items-end">
                        {item.ownerProductImage && (
                            <Image
                                source={{ uri: item.ownerProductImage }}
                                className="w-12 h-12 rounded-lg mt-1"
                            />
                        )}
                        {item.requesterProductImage && (
                            <Image
                                source={{ uri: item.requesterProductImage }}
                                className="w-12 h-12 rounded-lg mt-1"
                            />
                        )}
                    </View>
                </View>

                {isOwner ? (
                    <View className="flex flex-row mt-4 justify-between">
                        <TouchableOpacity
                            className="bg-gray-200 py-2 px-4 rounded-lg"
                            onPress={() => handleResponse(item.id, false, item)}
                        >
                            <Text className="font-bold text-gray-600">Tolak</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-gray-700 py-2 px-4 rounded-lg"
                            onPress={() => handleResponse(item.id, true, item)}
                        >
                            <Text className="font-bold text-white">Terima</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text className="mt-2 text-gray-600 italic">Permintaan telah dikirim</Text>
                )}
            </View>
        );
    };

    const renderHistory = ({ item }) => {
        const isOwner = item.ownerId === auth.currentUser.uid;
    
        return (
            <View className="bg-gray-100 p-4 rounded-lg mb-2">
                <View className="flex flex-row justify-between items-center">
                    <View className="flex-1">
                        <Text className="text-lg font-bold">
                            {isOwner
                                ? `Riwayat Barter dengan ${item.requesterName} (${item.requesterPhone})`
                                : `Riwayat Barter dengan ${item.ownerName} (${item.ownerPhone})`}
                        </Text>
                        <Text className={`text-sm font-bold ${item.status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>
                            Status: {item.status === 'accepted' ? 'Diterima' : 'Ditolak'}
                        </Text>
                        <Text className="text-gray-600">Barang Diminta: {item.ownerProductName}</Text>
                        <Text className="text-gray-600">
                            Jumlah Diminta: {item.requesterQuantity || 'Tidak tersedia'}
                        </Text>
                        <Text className="text-gray-600">Barang Ditawarkan: {item.requesterProductName}</Text>
                        <Text className="text-gray-600">
                            Jumlah Ditawarkan: {item.exchangeQty || 'Tidak tersedia'}
                        </Text>
                        <Text className="text-gray-600">
                            Tanggal: {new Date(item.timestamp.seconds * 1000).toLocaleString()}
                        </Text>
                    </View>
                    <View className="justify-center items-end">
                        {item.ownerProductImage && (
                            <Image
                                source={{ uri: item.ownerProductImage }}
                                className="w-12 h-12 rounded-lg mt-1"
                            />
                        )}
                        {item.requesterProductImage && (
                            <Image
                                source={{ uri: item.requesterProductImage }}
                                className="w-12 h-12 rounded-lg mt-1"
                            />
                        )}
                    </View>
                </View>
            </View>
        );
    };    

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
                    <TouchableWithoutFeedback>
                        <View className="bg-white w-11/12 h-4/5 rounded-lg p-4">
                            <View className="flex flex-row mb-4">
                                <TouchableOpacity
                                    className={`flex-1 items-center py-2 border-b-2 ${
                                        activeTab === 'requests' ? 'border-gray-700' : 'border-transparent'
                                    }`}
                                    onPress={() => setActiveTab('requests')}
                                >
                                    <Text
                                        className={`font-bold ${
                                            activeTab === 'requests' ? 'text-green-700' : 'text-green-900'
                                        }`}
                                    >
                                        Permintaan
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className={`flex-1 items-center py-2 border-b-2 ${
                                        activeTab === 'history' ? 'border-gray-700' : 'border-transparent'
                                    }`}
                                    onPress={() => setActiveTab('history')}
                                >
                                    <Text
                                        className={`font-bold ${
                                            activeTab === 'history' ? 'text-green-700' : 'text-green-900'
                                        }`}
                                    >
                                        Riwayat
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity className="ml-2" onPress={() => onClose()}>
                                    <Text className="text-xl">×</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={activeTab === 'requests' ? requests : history}
                                renderItem={activeTab === 'requests' ? renderRequests : renderHistory}
                                keyExtractor={(item) => item.id}
                                ListEmptyComponent={
                                    <Text className="text-center text-gray-600 mt-4">
                                        Belum ada {activeTab === 'requests' ? 'permintaan' : 'riwayat'} barter.
                                    </Text>
                                }
                                contentContainerStyle={{ paddingBottom: 16 }}
                                showsVerticalScrollIndicator={true}
                                keyboardShouldPersistTaps="handled"
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default RequestBarter;