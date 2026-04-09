const fs = require('fs');

const indexCode = fs.readFileSync('app/(tabs)/index.tsx', 'utf8');
const renderStartMarker = 'const renderAdminRequired = () => (';
const renderEndMarker = '  return (\n    <ThemedView style={styles.container}>';

const startIndex = indexCode.indexOf(renderStartMarker);
const endIndex = indexCode.indexOf(renderEndMarker);

if (startIndex === -1 || endIndex === -1) {
  console.log('Markers not found!');
  process.exit(1);
}

const renderMethodsStr = indexCode.substring(startIndex, endIndex);

const returnStr = `  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
        {showRegSuccess ? renderRegistrationSuccess() :
          showAddForm ? renderAddEmployeeForm() :
            isAdminAuthMode ? renderAdminRequired() :
              employee ? renderSuccess() :
                error ? renderFailure() :
                  renderScanning()}
      </ScrollView>

      {isOffline && (
        <View style={styles.offlineBanner}>
          <ThemedText style={styles.offlineBannerText}>Đang Offline (Mất Mạng)</ThemedText>
        </View>
      )}
    </ThemedView>
  );
`;

const generateComponent = (componentName) => `import React from 'react';
import { View, TouchableOpacity, Animated, ScrollView, TextInput, ActivityIndicator, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { styles } from '../styles/kioskStyles';
import { LayoutProps } from '../types/layout';

export const ${componentName}: React.FC<LayoutProps> = ({
  pulseAnim, error, employee, isAdminAuthMode, showAddForm, showRegSuccess, isOffline,
  recentActivity, unregisteredTagId, allEmployees, searchQuery, isLoadingEmployees,
  isUpdating, registrationTargetName, selectedEmployeeForUpdate, attendanceHistory, countdown, lastStatus,
  setError, readTag, handleAddUser, setIsAdminAuthMode, setEmployee,
  setSelectedEmployeeForUpdate, handleUpdateEmployeeNfc, setShowAddForm, setUnregisteredTagId, setSearchQuery
}) => {

  const filteredEmployees = allEmployees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  ${renderMethodsStr}

${returnStr}
};
`;

fs.mkdirSync('src/components', { recursive: true });
fs.writeFileSync('src/components/PortraitLayout.tsx', generateComponent('PortraitLayout'));
fs.writeFileSync('src/components/LandscapeLayout.tsx', generateComponent('LandscapeLayout'));
console.log('Layouts generated successfully.');
