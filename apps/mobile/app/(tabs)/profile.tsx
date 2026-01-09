import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/lib/auth-store';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, signOut, isAuthenticated } = useAuthStore();

    const handleLogout = async () => {
        await signOut();
        router.replace('/auth/login' as any);
    };

    if (!isAuthenticated && !user) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Account</Text>
                    <Text style={styles.message}>Please sign in to view your profile.</Text>
                    <TouchableOpacity style={styles.button} onPress={() => router.push('/auth/login' as any)}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>

                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        {user?.image ? (
                            <Image source={{ uri: user.image }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
                            </View>
                        )}
                        <TouchableOpacity style={styles.editBadge}>
                            <IconSymbol name="pencil" size={12} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{user?.name || 'User'}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                </View>

                <View style={styles.menu}>
                    <MenuItem icon="box.truck" label="My Orders" />
                    <MenuItem icon="heart" label="Wishlist" />
                    <MenuItem icon="map" label="Shipping Addresses" />
                    <MenuItem icon="creditcard" label="Payment Methods" />
                    <MenuItem icon="gear" label="Settings" />
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

function MenuItem({ icon, label }: { icon: string; label: string }) {
    return (
        <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
                <IconSymbol name={icon as any} size={20} color="#333" />
            </View>
            <Text style={styles.menuLabel}>{label}</Text>
            <IconSymbol name="chevron.right" size={16} color="#ccc" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    message: {
        fontSize: 16,
        color: '#666',
        marginBottom: 32,
    },
    button: {
        backgroundColor: '#000',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
        padding: 24,
        paddingBottom: 0,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#ccc',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#000',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: '#666',
    },
    menu: {
        paddingHorizontal: 24,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuIcon: {
        width: 40,
        alignItems: 'flex-start',
    },
    menuLabel: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    logoutButton: {
        margin: 24,
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        alignItems: 'center',
    },
    logoutText: {
        color: '#ff3b30',
        fontWeight: '600',
        fontSize: 16,
    },
});
