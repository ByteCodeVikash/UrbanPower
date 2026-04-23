import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Types';
import { Typography } from '../../components/Typography';
import { Header } from '../../components/Header';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/Theme';
import { SHOP_CATEGORIES } from '../../constants/MockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ShopCategoryScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Shopping" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.categoryGrid}>
          {SHOP_CATEGORIES.map((item) => (
            <Pressable 
              key={item.id} 
              style={styles.categoryCard}
              onPress={() => navigation.navigate('ShopSubCategory', { 
                categoryId: item.id, 
                categoryName: item.name 
              })}
            >
              <View style={styles.iconContainer}>
                <Image source={{ uri: item.icon }} style={styles.icon} />
              </View>
              <Typography variant="body2" weight="700" style={styles.categoryTitle} numberOfLines={2}>
                {item.name}
              </Typography>
            </Pressable>
          ))}
        </View>

        <View style={styles.infoBox}>
           <Typography variant="body2" color={Colors.light.textSecondary} style={{ textAlign: 'center' }}>
              Explore latest trends in fashion, electronics, and home decor. Best prices guaranteed.
           </Typography>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.surface },
  content: { padding: Spacing.md, paddingBottom: 100 },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: Colors.light.white,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.light.sm,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  icon: { width: 34, height: 34 },
  categoryTitle: { textAlign: 'center', color: Colors.light.text },
  infoBox: {
    marginTop: Spacing.xl,
    padding: Spacing.xl,
    backgroundColor: '#FDF2F8',
    borderRadius: BorderRadius.xl,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#DB2777',
  },
});
