import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Pressable, Image, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Calendar, Clock, MapPin, Truck } from 'lucide-react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/Theme';
import { KABADI_ITEMS } from '../../constants/MockData';
import { useAddresses } from '../../hooks/useServices';
import { useAuthStore } from '../../store/useAuthStore';

import { useKabadiStore } from '../../store/useKabadiStore';

export default function KabadiFormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { categoryId, subcategoryName, categoryName } = route.params || {};
  
  // Find the specific subcategory for pricing
  const parentCategory = KABADI_ITEMS.find(k => k.title === categoryName);
  const subcategory = parentCategory?.subcategories.find(s => s.id === categoryId);
  
  const { data: addresses } = useAddresses();
  const { user } = useAuthStore();
  const schedulePickup = useKabadiStore((state) => state.schedulePickup);

  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState('Morning (9-12)');
  const [instructions, setInstructions] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [weight, setWeight] = useState('');

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en-IN', { month: 'short' }),
      full: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    };
  });

  const handleSchedule = () => {
    if (!name || !weight) {
      alert('Please enter your name and estimated weight.');
      return;
    }
    schedulePickup({
      categories: [`${categoryName} - ${subcategoryName}`],
      address: addresses?.[0]?.details || 'Default Home',
      date: dates[selectedDate].full,
      timeSlot: selectedSlot,
      estimatedValue: (subcategory?.price || 0) * (parseFloat(weight) || 0),
      userName: name,
      estimatedWeight: weight
    });
    alert('Pickup scheduled successfully!');
    navigation.navigate('KabadiBooking' as any); // Navigate to confirmation/booking flow
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={Colors.light.text} size={24} />
        </Pressable>
        <Typography variant="h3" weight="700">Schedule Pickup</Typography>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.selectedBox}>
           <View style={styles.categoryIcon}>
              <Image source={{ uri: parentCategory?.icon || 'https://cdn-icons-png.flaticon.com/512/2541/2541936.png' }} style={styles.icon} />
           </View>
           <View style={{ marginLeft: Spacing.md, flex: 1 }}>
              <Typography variant="caption" color={Colors.light.textSecondary} weight="700">
                {categoryName?.toUpperCase()}
              </Typography>
              <Typography variant="body1" weight="800">{subcategoryName || 'General Scrap'}</Typography>
              <Typography variant="body2" color={Colors.light.success} weight="700">₹{subcategory?.price || 'Market Rate'}/kg</Typography>
           </View>
           <View style={styles.verifiedBadge}>
              <Typography variant="tiny" color={Colors.light.success} weight="700">Rate Verified</Typography>
           </View>
        </View>

        <View style={styles.section}>
          <Typography variant="h3" weight="700" style={styles.sectionTitle}>Your Details</Typography>
          <View style={styles.inputGroup}>
            <View style={{ flex: 1 }}>
              <Typography variant="caption" color={Colors.light.textSecondary} style={{ marginBottom: 4 }}>NAME</Typography>
              <TextInput 
                style={styles.singleLineInput}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.md }}>
              <Typography variant="caption" color={Colors.light.textSecondary} style={{ marginBottom: 4 }}>ESTIMATED WEIGHT (KG)</Typography>
              <TextInput 
                style={styles.singleLineInput}
                placeholder="e.g. 10"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Typography variant="h3" weight="700" style={styles.sectionTitle}>Select Date</Typography>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datePicker}>
            {dates.map((item, index) => (
              <Pressable 
                key={index} 
                style={[styles.dateChip, selectedDate === index && styles.activeChip]}
                onPress={() => setSelectedDate(index)}
              >
                <Typography variant="tiny" weight="700" color={selectedDate === index ? Colors.light.white : Colors.light.textSecondary}>
                  {item.day.toUpperCase()}
                </Typography>
                <Typography variant="h3" weight="800" color={selectedDate === index ? Colors.light.white : Colors.light.text}>
                  {item.date}
                </Typography>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Typography variant="h3" weight="700" style={styles.sectionTitle}>Select Time Slot</Typography>
          <View style={styles.slotGrid}>
            {['Morning (9-12)', 'Afternoon (12-4)', 'Evening (4-7)'].map((slot) => (
              <Pressable 
                key={slot} 
                style={[styles.slotChip, selectedSlot === slot && styles.activeChip]}
                onPress={() => setSelectedSlot(slot)}
              >
                <Typography variant="body2" weight="700" color={selectedSlot === slot ? Colors.light.white : Colors.light.text}>
                  {slot.split(' ')[0]}
                </Typography>
                <Typography variant="tiny" color={selectedSlot === slot ? 'rgba(255,255,255,0.7)' : Colors.light.textSecondary}>
                   {slot.split(' ')[1]}
                </Typography>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.addressSection}>
          <Typography variant="h3" weight="700" style={styles.sectionTitle}>Pickup Address</Typography>
          <View style={styles.addressCard}>
            <MapPin color={Colors.light.primary} size={24} />
            <View style={{ marginLeft: Spacing.md, flex: 1 }}>
              <Typography variant="body1" weight="800">{addresses?.[0]?.type || 'Default Home'}</Typography>
              <Typography variant="body2" color={Colors.light.textSecondary} numberOfLines={2}>
                 {addresses?.[0]?.details || 'Add address in profile'}
              </Typography>
            </View>
            <View style={styles.changeBtn}>
               <Typography variant="tiny" color={Colors.light.primary} weight="700">CHANGE</Typography>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Typography variant="h3" weight="700" style={styles.sectionTitle}>Instructions (Optional)</Typography>
          <TextInput 
            style={styles.input}
            placeholder="e.g. Call before arrival, gate code 1234..."
            value={instructions}
            onChangeText={setInstructions}
            multiline
          />
        </View>

        <View style={styles.hintBox}>
           <Truck size={20} color={Colors.light.primary} />
           <Typography variant="body2" color={Colors.light.textSecondary} style={{ marginLeft: Spacing.sm, flex: 1 }}>
              Professional will bring a digital scale. Instant payment via UPI or Cash.
           </Typography>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Confirm & Schedule" 
          onPress={handleSchedule} 
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.white },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  iconBtn: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
  },
  content: { padding: Spacing.xl },
  selectedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
  },
  categoryIcon: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.light.white,
    justifyContent: 'center', alignItems: 'center',
    ...Shadows.light.sm,
  },
  icon: { width: 34, height: 34 },
  verifiedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1, borderColor: '#A7F3D0',
  },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { marginBottom: Spacing.md },
  inputGroup: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  singleLineInput: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: 14,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
  },
  datePicker: { paddingVertical: Spacing.sm },
  dateChip: {
    width: 70, height: 80,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.light.surface,
    marginRight: Spacing.md,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.light.borderLight,
  },
  activeChip: { 
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
    ...Shadows.light.sm,
  },
  slotGrid: { flexDirection: 'row', gap: Spacing.sm },
  slotChip: {
    flex: 1, height: 60,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.surface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.light.borderLight,
  },
  addressSection: { marginBottom: Spacing.xl },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.white,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1, borderColor: Colors.light.borderLight,
    ...Shadows.light.sm,
  },
  changeBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.md,
  },
  input: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    color: Colors.light.text,
    borderWidth: 1, borderColor: Colors.light.borderLight,
  },
  hintBox: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primaryLight,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: 40,
    backgroundColor: Colors.light.white,
    borderTopWidth: 1, borderTopColor: Colors.light.borderLight,
    ...Shadows.light.lg,
  },
});

