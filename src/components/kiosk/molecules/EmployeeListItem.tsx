import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { EmployeeAvatar } from '../atoms/EmployeeAvatar';
import { Employee } from '../../../types';

interface EmployeeListItemProps {
  employee: Employee;
  onPress: (emp: Employee) => void;
  showStatusBadge?: boolean;
  avatarSize?: number;
}

export const EmployeeListItem: React.FC<EmployeeListItemProps> = ({
  employee,
  onPress,
  showStatusBadge = false,
  avatarSize = 60,
}) => (
  <TouchableOpacity
    onPress={() => onPress(employee)}
    style={{
      backgroundColor: '#fff',
      borderRadius: 24,
      padding: 16,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.02,
      shadowRadius: 10,
      elevation: 2,
    }}
  >
    <View style={{ position: 'relative' }}>
      <EmployeeAvatar avatar={employee.avatar} size={avatarSize} />
      <View
        style={{
          position: 'absolute',
          bottom: -2,
          right: -2,
          width: 14,
          height: 14,
          borderRadius: 7,
          backgroundColor: '#22c55e',
          borderWidth: 2,
          borderColor: '#fff',
        }}
      />
    </View>

    <View style={{ flex: 1, marginLeft: 20 }}>
      {showStatusBadge ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <ThemedText style={{ fontSize: 18, fontWeight: '900', color: '#1e293b' }}>
            {employee.name}
          </ThemedText>
          <View
            style={{
              backgroundColor: '#dcfce7',
              paddingHorizontal: 10,
              paddingVertical: 2,
              borderRadius: 8,
            }}
          >
            <ThemedText style={{ color: '#166534', fontSize: 10, fontWeight: '800' }}>
              Hoạt động
            </ThemedText>
          </View>
        </View>
      ) : (
        <ThemedText style={{ fontSize: 18, fontWeight: '900', color: '#1e293b' }}>
          {employee.name}
        </ThemedText>
      )}

      <ThemedText
        style={{ fontSize: 13, color: '#64748b', fontWeight: '700', marginTop: showStatusBadge ? 4 : 2 }}
      >
        ID: {employee.employee_code || `#EMP-${employee.id}`}
      </ThemedText>

      {showStatusBadge ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <MaterialCommunityIcons
            name="briefcase-outline"
            size={14}
            color="#94a3b8"
            style={{ marginRight: 6 }}
          />
          <ThemedText style={{ fontSize: 13, color: '#475569', fontWeight: '600' }}>
            {employee.department || 'N/A'}
          </ThemedText>
        </View>
      ) : (
        <ThemedText style={{ fontSize: 13, color: '#475569', marginTop: 2 }}>
          Phòng ban: {employee.department || 'N/A'}
        </ThemedText>
      )}
    </View>

    <Ionicons name="chevron-forward" size={20} color="#cbd5e1" style={{ marginLeft: 10 }} />
  </TouchableOpacity>
);
