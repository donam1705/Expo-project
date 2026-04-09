import React from 'react';
import { View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { styles } from '../../../styles/kioskStyles';
import { ms } from '../../../utils/scaling';
import { NfcTagBanner } from '../molecules/NfcTagBanner';
import { SearchBar } from '../molecules/SearchBar';
import { EmployeeListItem } from '../molecules/EmployeeListItem';
import { InfoField } from '../atoms/InfoField';
import { EmployeeAvatar } from '../atoms/EmployeeAvatar';
import { ScreenLayout } from '../ScreenLayout';
import { useKiosk } from '../../../contexts/KioskContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AddEmployeeFormScreenProps {
  layout: 'landscape' | 'portrait';
}

export const AddEmployeeFormScreen: React.FC<AddEmployeeFormScreenProps> = ({
  layout,
}) => {
  const insets = useSafeAreaInsets();

  const {
    unregisteredTagId,
    allEmployees,
    searchQuery,
    isLoadingEmployees,
    isUpdating,
    selectedEmployeeForUpdate,
    setSelectedEmployeeForUpdate,
    handleUpdateEmployeeNfc,
    setShowAddForm,
    setUnregisteredTagId,
    setSearchQuery,
  } = useKiosk();
  const isLandscape = layout === 'landscape';

  const filteredEmployees = allEmployees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cancelAndReset = () => {
    setShowAddForm(false);
    setUnregisteredTagId(null);
    setSearchQuery('');
  };

  if (selectedEmployeeForUpdate) {
    const emp = selectedEmployeeForUpdate;

    const selectedHeader = (
      <View style={{ width: '100%', alignItems: 'flex-start', paddingBottom: ms(10) }}>
        <TouchableOpacity
          onPress={() => setSelectedEmployeeForUpdate(null)}
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: ms(8), paddingRight: ms(16) }}
        >
          <Ionicons name="arrow-back" size={ms(26)} color="#1e293b" />
          <ThemedText style={{ fontSize: ms(18), fontWeight: '800', color: '#1e293b', marginLeft: ms(8) }}>
            Hồ sơ nhân viên
          </ThemedText>
        </TouchableOpacity>
      </View>
    );

    const selectedCard = (
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: ms(28),
          padding: isLandscape ? ms(24) : ms(28),
          flex: 1,
          shadowColor: '#000',
          shadowOpacity: 0.03,
          shadowRadius: ms(20),
          elevation: 5,
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: ms(16) }}>
          <View
            style={{
              width: isLandscape ? ms(110) : ms(130),
              height: isLandscape ? ms(110) : ms(130),
              borderRadius: ms(100),
              backgroundColor: '#f1f5f9',
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <EmployeeAvatar
              avatar={emp.avatar}
              size={isLandscape ? ms(110) : ms(130)}
              borderRadius={ms(100)}
              fallbackVariant="account"
            />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: ms(12) }}
        >

          <InfoField label="HỌ VÀ TÊN" value={emp.name} style={{ marginBottom: ms(12) }} />
          <View style={{ height: 1, backgroundColor: '#f1f5f9', width: '100%', marginBottom: ms(12) }} />

          <InfoField label="PHÒNG BAN" value={emp.department || 'N/A'} style={{ marginBottom: ms(12) }} />
          <View style={{ height: 1, backgroundColor: '#f1f5f9', width: '100%', marginBottom: ms(12) }} />

          <InfoField label="MÃ NHÂN VIÊN" value={emp.employee_code || `#EMP-${emp.id}`} style={{ marginBottom: ms(12) }} />
          <View style={{ height: 1, backgroundColor: '#f1f5f9', width: '100%', marginBottom: ms(12) }} />

          <View style={{ marginBottom: ms(12) }}>
            <ThemedText style={{ fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 1 }}>TRẠNG THÁI LÀM VIỆC</ThemedText>
            <View style={{ alignSelf: 'flex-start', backgroundColor: '#ccfbf1', paddingHorizontal: ms(12), paddingVertical: ms(6), borderRadius: ms(12), marginTop: ms(8) }}>
              <ThemedText style={{ color: '#059669', fontSize: ms(12), fontWeight: '800' }}>Hoạt động</ThemedText>
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: '#f1f5f9', width: '100%', marginBottom: ms(12) }} />

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: ms(4) }}>
            <View
              style={{
                width: ms(40),
                height: ms(40),
                borderRadius: ms(20),
                backgroundColor: '#eff6ff',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: ms(14),
              }}
            >
              <Ionicons name="bluetooth" size={ms(20)} color="#3b82f6" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontSize: ms(15), fontWeight: '800', color: '#1e293b' }}>
                Trạng thái thẻ NFC
              </ThemedText>
              <ThemedText style={{ fontSize: ms(13), color: '#64748b', marginTop: ms(2) }}>
                {emp.barcode
                  ? 'Nhân viên đã được gán thẻ, nhấn Đăng kí để thay thẻ.'
                  : 'Nhân viên chưa được gán thẻ.'}
              </ThemedText>
            </View>
          </View>
        </ScrollView>
      </View>
    );

    const selectedFooter = (
      <TouchableOpacity
        style={[styles.primaryButton, { height: 60, borderRadius: 16 }]}
        onPress={() => handleUpdateEmployeeNfc(emp)}
        disabled={isUpdating}
      >
        {isUpdating ? (
          <ActivityIndicator color="white" />
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="nfc-variant" size={24} color="white" style={{ marginRight: 10 }} />
            <ThemedText style={styles.primaryButtonText}>Đăng kí thẻ</ThemedText>
          </View>
        )}
      </TouchableOpacity>
    );

    const safeBottom = Math.max(insets.bottom, ms(16));

    return (
      <View style={{ flex: 1, paddingHorizontal: ms(20), paddingTop: ms(10), paddingBottom: safeBottom, width: '100%', height: '100%', backgroundColor: '#f8fafc' }}>
        {selectedHeader}
        <View style={{ flex: 1, width: '100%', maxWidth: ms(700), alignSelf: 'center' }}>
          {selectedCard}
          <View style={{ paddingTop: ms(16), paddingBottom: ms(8) }}>
            {selectedFooter}
          </View>
        </View>
      </View>
    );
  }

  const headerSection = (
    <View style={{ width: '100%', flex: isLandscape ? 1 : undefined, paddingTop: isLandscape ? 20 : 0, alignItems: 'center', justifyContent: 'flex-start' }}>
      <View style={[styles.titleContainer, { alignItems: isLandscape ? 'center' : 'flex-start', marginBottom: 12, width: '100%' }]}>
        <ThemedText style={[styles.pageTitle, { fontSize: isLandscape ? 20 : 24 }, isLandscape && { textAlign: 'center' }]}>
          Tìm kiếm nhân viên
        </ThemedText>
        <ThemedText style={[styles.pageSubtitle, isLandscape && { textAlign: 'center' }]}>
          Để gán thẻ mới hoặc thay đổi thông tin thẻ
        </ThemedText>
      </View>
      <NfcTagBanner tagId={unregisteredTagId || ''} compact={isLandscape} />
      <View style={{ width: '100%', marginTop: 12 }}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={isLandscape ? 'Tìm tên nhân viên...' : 'Tìm kiếm nhân viên theo tên hoặc ID...'}
        />
      </View>
    </View>
  );

  const cardSection = (
    <View style={{ flex: 1, width: '100%' }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          marginTop: 4,
        }}
      >
        <ThemedText style={{ fontSize: isLandscape ? 16 : 20, fontWeight: '900', color: '#1e293b' }}>
          Danh sách nhân viên ({filteredEmployees.length})
        </ThemedText>
      </View>

      {isLoadingEmployees ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0056D2" />
          <ThemedText style={{ marginTop: 15, color: '#64748b' }}>
            Đang tải danh sách nhân viên...
          </ThemedText>
        </View>
      ) : (
        <View style={{ flex: 1, overflow: 'hidden' }}>
          <ScrollView
            nestedScrollEnabled
            persistentScrollbar
            showsVerticalScrollIndicator
            contentContainerStyle={{ paddingRight: 8, paddingBottom: 20 }}
          >
            {filteredEmployees.map((emp) => (
              <EmployeeListItem
                key={emp.id}
                employee={emp}
                onPress={setSelectedEmployeeForUpdate}
                showStatusBadge={!isLandscape}
                avatarSize={isLandscape ? 60 : 80}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const footerSection = (
    <TouchableOpacity
      style={[
        styles.primaryButton,
        {
          backgroundColor: '#f1f5f9',
          height: isLandscape ? 56 : 60,
          borderWidth: 1,
          borderColor: '#e2e8f0',
        },
      ]}
      onPress={cancelAndReset}
    >
      <ThemedText style={[styles.primaryButtonText, { color: '#64748b' }]}>HUỶ BỎ</ThemedText>
    </TouchableOpacity>
  );

  return (
    <ScreenLayout
      layout={layout}
      headerSection={headerSection}
      cardSection={cardSection}
      footerSection={footerSection}
    />
  );
};
