import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Types';
import { Typography } from '../../components/Typography';
import { Header } from '../../components/Header';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/Theme';
import { GROCERY_CATEGORIES } from '../../constants/MockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function GroceryCategoryScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Grocery" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.categoryGrid}>
          {GROCERY_CATEGORIES.map((item) => (
            <Pressable 
              key={item.id} 
              style={styles.categoryCard}
              onPress={() => navigation.navigate('GrocerySubCategory', { 
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
              Fresh groceries delivered to your doorstep in minutes. Quality guaranteed.
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
    width: '30.5%',
    backgroundColor: Colors.light.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.light.sm,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
    marginBottom: Spacing.xs,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  icon: { width: 28, height: 28 },
  categoryTitle: { textAlign: 'center', fontSize: 11, color: Colors.light.text },
  infoBox: {
    marginTop: Spacing.xl,
    padding: Spacing.xl,
    backgroundColor: '#EFF6FF',
    borderRadius: BorderRadius.xl,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
});
