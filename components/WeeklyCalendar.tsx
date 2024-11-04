import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { format, startOfWeek, addDays, subWeeks, addWeeks, isSameDay, isFuture, endOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';

interface WeeklyCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function WeeklyCalendar({ selectedDate, onSelectDate }: WeeklyCalendarProps) {
  const [week, setWeek] = useState<Date[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(selectedDate, { weekStartsOn: 0, locale: ko }));

  useEffect(() => {
    const days = [...Array(7)].map((_, i) => addDays(currentWeekStart, i));
    setWeek(days);
  }, [currentWeekStart]);

  const handlePrevWeek = () => {
    const prevWeek = subWeeks(currentWeekStart, 1);
    setCurrentWeekStart(prevWeek);
    const prevWeekSaturday = addDays(prevWeek, 6);
    onSelectDate(prevWeekSaturday);
  };

  const handleNextWeek = () => {
    const nextWeek = addWeeks(currentWeekStart, 1);
    if (!isFuture(nextWeek)) {
      setCurrentWeekStart(nextWeek);
      if (!isFuture(nextWeek)) {
        onSelectDate(nextWeek);
      }
    }
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const isSelected = (date: Date) => {
    return isSameDay(date, selectedDate);
  };

  const isFutureDate = (date: Date) => {
    return isFuture(date);
  };

  const handleDateSelect = (date: Date) => {
    if (!isFutureDate(date)) {
      onSelectDate(date);
    }
  };

  const isNextWeekDisabled = () => {
    const nextWeek = addWeeks(currentWeekStart, 1);
    return isFuture(nextWeek);
  };

  useEffect(() => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0, locale: ko });
    setCurrentWeekStart(weekStart);
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevWeek} style={styles.arrowButton}>
          <Ionicons name="chevron-back" size={24} color={Colors.light.tint} />
        </TouchableOpacity>
        <ThemedText style={styles.monthText}>
          {format(selectedDate, 'yyyy년 M월', { locale: ko })}
        </ThemedText>
        <TouchableOpacity 
          onPress={handleNextWeek} 
          style={[
            styles.arrowButton,
            isNextWeekDisabled() && styles.disabledButton
          ]}
          disabled={isNextWeekDisabled()}
        >
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={isNextWeekDisabled() ? '#ccc' : Colors.light.tint} 
          />
        </TouchableOpacity>
      </View>
      <View style={styles.weekContainer}>
        {week.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayButton,
              isSelected(date) && styles.selectedDay,
              isToday(date) && styles.today,
              isFutureDate(date) && styles.futureDay
            ]}
            onPress={() => handleDateSelect(date)}
            disabled={isFutureDate(date)}
          >
            <ThemedText style={[
              styles.weekdayText,
              index === 0 && styles.sundayText,
              index === 6 && styles.saturdayText,
              isFutureDate(date) && styles.futureDayText
            ]}>
              {format(date, 'E', { locale: ko })}
            </ThemedText>
            <ThemedText
              style={[
                styles.dateText,
                isSelected(date) && styles.selectedText,
                isToday(date) && styles.todayText,
                index === 0 && styles.sundayText,
                index === 6 && styles.saturdayText,
                isFutureDate(date) && styles.futureDayText
              ]}
            >
              {format(date, 'd')}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  arrowButton: {
    padding: 5,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  dayButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: (Dimensions.get('window').width - 60) / 7,
    height: 70,
    borderRadius: 10,
  },
  weekdayText: {
    fontSize: 12,
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
  },
  selectedDay: {
    backgroundColor: Colors.light.tint + '20',
    borderWidth: 1,
    borderColor: Colors.light.tint,
    borderRadius: 8,
  },
  selectedText: {
    color: Colors.light.tint,
    fontWeight: 'bold',
  },
  today: {
    borderWidth: 1,
    borderColor: Colors.light.tint,
    borderRadius: 8,
  },
  todayText: {
    color: Colors.light.tint,
    fontWeight: 'bold',
  },
  sundayText: {
    color: '#FF4444',
  },
  saturdayText: {
    color: '#4444FF',
  },
  futureDay: {
    opacity: 0.5,
  },
  futureDayText: {
    color: '#ccc',
  },
  disabledButton: {
    opacity: 0.5,
  },
}); 