import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const remindersByGoal = {
    'Lose Weight': [
        { id: 1, title: '🔥 Burn Calories', message: 'Do 30 min cardio today. You can do it!' },
        { id: 2, title: '💧 Drink Water', message: 'Water boosts metabolism, Drink 2 glasses now!' },
        { id: 3, title: '📉 Track Progress', message: 'Weigh yourself today. Progress motivates!' },
        { id: 4, title: '🍌 Healthy Snack', message: 'Have at least 2 fruits today!' },
        { id: 5, title: '🏃 Move More', message: 'Take the stairs, Every step counts!' },
        { id: 6, title: '🚫 Skip Sugary Drinks', message: 'Drink water or black coffee instead of soda today.' },
    ],
    'Gain Muscle': [
        { id: 1, title: '🍗 Protein First', message: 'Eat protein within 30 min after your workout!' },
        { id: 2, title: '🏋️ Progressive Overload', message: 'Add 2.5kg this week, you can do it!' },
        { id: 3, title: '💤 Sleep for Growth', message: 'Muscles grow when you rest Get 7-8 hours of sleep!' },
        { id: 4, title: '💪 Train to Failure', message: 'Last 2 reps should be hard. Push yourself!' },
        { id: 5, title: '🦵 Don\'t Skip Leg Day', message: 'Legs are the biggest muscles, Train them hard!' },
    ],
    'Maintain Weight': [
        { id: 1, title: '⭐ Stay Consistent', message: 'Consistency beats intensity, Keep showing up!' },
        { id: 2, title: '⭐ Small Wins', message: '15 minutes today is still a win!' },
        { id: 3, title: '🏆 You\'re Doing Great', message: 'Maintaining is an achievement, Proud of you!' },
        { id: 4, title: '🛏️ Rest & Recover', message: 'Rest days are important too, Listen to your body.' },
        { id: 5, title: '📊 Check Progress', message: 'Review your week, celebrate the small victories!' },
        { id: 6, title: '💧 Stay Hydrated', message: 'Water keeps everything working. Drink up!' },
        { id: 7, title: '💤 Sleep Well', message: 'Quality sleep = better workouts tomorrow.' },
    ],
};
async function getUserGoal() {
    const userId = auth.currentUser?.uid;
    if (!userId) return 'Maintain Weight';

    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
        const goal = userDoc.data().targetGoal;
        if (goal === 'Lose Weight') return 'Lose Weight';
        if (goal === 'Gain Muscle') return 'Gain Muscle';
    }
    return 'Maintain Weight';
}

export async function getTodayReminder() {
    const userGoal = await getUserGoal();
    const reminders = remindersByGoal[userGoal];
    const dayOfYear = getDayOfYear();
    const index = (dayOfYear - 1) % reminders.length;
    return reminders[index];
}

export async function hasSeenTodayReminder() {
    const today = new Date().toDateString();
    const lastSeen = await AsyncStorage.getItem('lastReminderSeen');
    return lastSeen === today;
}

export async function markReminderSeen() {
    const today = new Date().toDateString();
    await AsyncStorage.setItem('lastReminderSeen', today);
}

function getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 86400000;
    return Math.floor(diff / oneDay);
}