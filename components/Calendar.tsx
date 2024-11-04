import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/auth';
import { diaryAPI } from '@/utils/api';
import {
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay,
  addMonths,
  subMonths,
  isFuture,
  isToday,
  getDay,
  setDefaultOptions
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';

// 한국 시간대 설정
setDefaultOptions({ locale: ko });



interface CalendarProps {
  onSelectDate: (date: Date) => void;
  refresh: number;
}

const Calendar = ({ onSelectDate, refresh }: CalendarProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [daysWithImages, setDaysWithImages] = useState<{[key: number]: boolean}>({});
  const { userId } = useAuth();
  const today = new Date();
  const fetchMonthImagesStatus = async (date: Date) => {
    if (!userId) return;
    
    try {
      const response = await diaryAPI.getDiaryImagesStatus(
        userId, 
        date.getFullYear(), 
        date.getMonth() + 1
      );
      
      setDaysWithImages(response.data.daysWithImages);
    } catch (error) {
      console.error('월별 이미지 상태 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchMonthImagesStatus(selectedDate);
  }, [selectedDate.getMonth(), userId, refresh]);

  const handleMonthChange = (delta: number) => {
    const newDate = delta > 0 ? addMonths(selectedDate, 1) : subMonths(selectedDate, 1);
    if (!isFuture(startOfMonth(newDate))) {
      const targetDate = delta > 0 ? 
        endOfMonth(newDate) : 
        new Date(newDate.getFullYear(), newDate.getMonth(), selectedDate.getDate());
      
      if (isFuture(targetDate)) {
        setSelectedDate(new Date());
      } else {
        setSelectedDate(targetDate);
      }
    }
  };

  const handleDayPress = async (date: Date) => {
    if (!isFuture(date)) {
      setSelectedDate(date);
      onSelectDate(date);
    }
  };

  const renderDays = () => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    const days = eachDayOfInterval({ start, end });
    const startWeek = getDay(start);
    const hasImages = (dayNumber: number) => daysWithImages[dayNumber];
    const emptyDays = Array(startWeek).fill(null);
    const allDays = [...emptyDays, ...days];

    return (
      <View style={styles.daysContainer}>
        {allDays.map((date, index) => {
          if (!date) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const isSelected = isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);
          const isFutureDate = isFuture(date);
          const isWeekend = getDay(date) === 0 || getDay(date) === 6;

          return (
            <TouchableOpacity
              key={date.toString()}
              style={[
                styles.dayCell,
                isSelected && styles.selectedDay,
                isTodayDate && styles.today,
                isFutureDate && styles.futureDay
              ]}
              onPress={() => handleDayPress(date)}
              disabled={isFutureDate}
            >
              <View style={styles.dayContent}>
                <ThemedText style={[
                  styles.dayText,
                  isWeekend && (getDay(date) === 0 ? styles.sundayText : styles.saturdayText),
                  isSelected && styles.selectedText,
                  isTodayDate && styles.todayText,
                  isFutureDate && styles.futureDayText
                ]}>
                  {format(date, 'd')}
                </ThemedText>
                {
                  hasImages(Number(format(date, 'd'))) && 
                  <View style={styles.imageIndicator}>
                    <Ionicons name="images-outline" size={12} color={Colors.light.tint} />
                  </View>
                }
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleMonthChange(-1)} style={styles.arrowButton}>
          <Ionicons name="chevron-back" size={20} color={Colors.light.tint} />
        </TouchableOpacity>
        <ThemedText style={styles.monthText}>
          {format(selectedDate, 'yyyy년 M월')}
        </ThemedText>
        <TouchableOpacity 
          onPress={() => handleMonthChange(1)} 
          style={[
            styles.arrowButton,
            isFuture(addMonths(startOfMonth(selectedDate), 1)) && styles.disabledButton
          ]}
          disabled={isFuture(addMonths(startOfMonth(selectedDate), 1))}
        >
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isFuture(addMonths(startOfMonth(selectedDate), 1)) ? '#ccc' : Colors.light.tint} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.weekDays}>
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <View key={day} style={styles.weekDayContainer}>
            <ThemedText 
              style={[
                styles.weekDay,
                index === 0 && styles.sundayText,
                index === 6 && styles.saturdayText
              ]}
            >
              {day}
            </ThemedText>
          </View>
        ))}
      </View>

      {renderDays()}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '3%',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4%',
    paddingHorizontal: '2%',
  },
  arrowButton: {
    padding: '2%',
  },
  monthText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '3%',
  },
  weekDayContainer: {
    flex: 1,
    alignItems: 'center',
  },
  weekDay: {
    fontSize: 11,
    textAlign: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: '1%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    textAlign: 'center',
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
  thumbnailContainer: {
    width: '70%',
    height: '30%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnail: {
    width: '60%',
    height: '100%',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#fff',
  },
  imageIndicator: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

export default Calendar;
