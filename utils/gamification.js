import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, collection, getDocs } from 'firebase/firestore';

const allBadges = [
    {
        id: '1',
        name: 'First Win',
        description: 'Completed your first workout',
        icon: '⭐',
        requirement: { type: 'totalWorkouts', count: 1 }
    },
    {
        id: '2',
        name: '3-Day Streak',
        description: 'Worked out 3 days in a row',
        icon: '🏅',
        requirement: { type: 'streak', count: 3 }
    },
    {
        id: '3',
        name: 'Beast Mode',
        description: 'Completed 25 workouts',
        icon: '🏅',
        requirement: { type: 'totalWorkouts', count: 25 }
    },
    {
        id: '4',
        name: 'Super Star',
        description: 'Worked out 7 days in a row',
        icon: '⭐',
        requirement: { type: 'streak', count: 7 }
    },
    {
        id: '5',
        name: 'Calorie Crusher',
        description: 'Burned 100 total calories',
        icon: '🔥',
        requirement: { type: 'totalCalories', count: 100 }
    },
    {
        id: '6',
        name: 'Sip Sip Hooray',
        description: 'Drank 10 cups of water',
        icon: '💧',
        requirement: { type: 'totalWater', count: 10 }
    },
    {
        id: '7',
        name: 'Time Keeper',
        description: 'Reached 100 active minutes',
        icon: '⏱️',
        requirement: { type: 'totalMinutes', count: 100 }
    },
];

export async function getEarnedBadges() {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
        const earned = userDoc.data().earnedBadges || [];

        return earned.map(badge => {
            const fullBadge = allBadges.find(b => b.id === badge.id);
            return fullBadge ? { ...badge, icon: fullBadge.icon } : badge;
        });
    }
    return [];
}

export async function getTotalWorkouts() {
    const userId = auth.currentUser?.uid;
    if (!userId) return 0;
    const completionsRef = collection(db, 'users', userId, 'completedWorkouts');
    const querySnapshot = await getDocs(completionsRef);
    let total = 0;
    querySnapshot.forEach(doc => {
        total += doc.data().count || 0;
    });
    return total;
}

export async function calculateStreak() {
    const userId = auth.currentUser?.uid;
    if (!userId) return 0;

    const completionsRef = collection(db, 'users', userId, 'workoutCompletion');
    const querySnapshot = await getDocs(completionsRef);

    const completedDates = [];
    querySnapshot.forEach(doc => {
        if (doc.data().completed) {
            completedDates.push(doc.id);
        }
    });

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        if (completedDates.includes(dateStr)) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
}
export async function checkAndAwardBadges(userStats) {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];

    const earnedBadges = await getEarnedBadges();
    const newBadges = [];

    for (const badge of allBadges) {
        if (earnedBadges.some(b => b.id === badge.id)) continue;

        let earned = false;

        switch (badge.requirement.type) {
            case 'totalWorkouts':
                if (userStats.totalWorkouts >= badge.requirement.count) earned = true;
                break;
            case 'streak':
                if (userStats.currentStreak >= badge.requirement.count) earned = true;
                break;
            case 'totalCalories':
                if (userStats.totalCalories >= badge.requirement.count) earned = true;
                break;
            case 'totalWater':
                if (userStats.totalWater >= badge.requirement.count) earned = true;
                break;
            case 'totalMinutes':
                if (userStats.totalMinutes >= badge.requirement.count) earned = true;
                break;
        }

        if (earned) {
            newBadges.push({
                ...badge,
                earnedAt: new Date().toISOString()
            });
        }
    }

    if (newBadges.length > 0) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            earnedBadges: arrayUnion(...newBadges)
        });
    }

    return newBadges;
}
export async function getTotalCalories() {
    const userId = auth.currentUser?.uid;
    if (!userId) return 0;

    const progressRef = collection(db, 'users', userId, 'dailyProgress');
    const querySnapshot = await getDocs(progressRef);
    let total = 0;
    querySnapshot.forEach(doc => {
        total += doc.data().calories || 0;
    });
    return total;
}

export async function getTotalWater() {
    const userId = auth.currentUser?.uid;
    if (!userId) return 0;

    const progressRef = collection(db, 'users', userId, 'dailyProgress');
    const querySnapshot = await getDocs(progressRef);
    let total = 0;
    querySnapshot.forEach(doc => {
        total += doc.data().water || 0;
    });
    return total;
}

export async function getTotalMinutes() {
    const userId = auth.currentUser?.uid;
    if (!userId) return 0;

    const progressRef = collection(db, 'users', userId, 'dailyProgress');
    const querySnapshot = await getDocs(progressRef);
    let total = 0;
    querySnapshot.forEach(doc => {
        total += doc.data().minutes || 0;
    });
    return total;
}