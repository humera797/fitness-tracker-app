import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { exercisesData } from '../data/exercises';

async function getUserGoalAndBMI() {
    const userId = auth.currentUser?.uid;
    if (!userId) return { goal: 'Maintain Weight', bmi: 22 };

    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
        const data = userDoc.data();
        const goal = data.targetGoal || 'Maintain Weight';
        const bmi = data.bmi || 22;
        return { goal, bmi };
    }
    return { goal: 'Maintain Weight', bmi: 22 };
}

export async function getWorkoutPlanName() {
    const { goal, bmi } = await getUserGoalAndBMI();

    if (goal === 'Lose Weight' && bmi >= 25) return 'Fat Loss Workout';
    if (goal === 'Gain Muscle') return 'Strength Training Plan';
    if (goal === 'Maintain Weight') return 'Balanced Fitness Plan';
    return 'General Fitness Plan';
}

export async function getWorkoutForDate(date) {
    const planName = await getWorkoutPlanName();
    const userId = auth.currentUser?.uid;

    const allExercises = [
        ...(exercisesData.FULLBODY || []),
        ...(exercisesData.ABS || []),
        ...(exercisesData.LEGS || []),
        ...(exercisesData.ARMS || []),
        ...(exercisesData.BACK || []),
        ...(exercisesData.CHEST || []),
        ...(exercisesData.SHOULDERS || []),
        ...(exercisesData.GLUTES || []),
    ];

    let exerciseCount = 5;
    if (planName === 'Fat Loss Workout') exerciseCount = 6;
    if (planName === 'Strength Training Plan') exerciseCount = 5;
    if (planName === 'Balanced Fitness Plan') exerciseCount = 4;

    const shuffled = [...allExercises];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const selectedExercises = shuffled.slice(0, exerciseCount);

    let isCompleted = false;
    if (userId) {
        const completionRef = doc(db, 'users', userId, 'workoutCompletion', date);
        const completionSnap = await getDoc(completionRef);
        isCompleted = completionSnap.exists() && completionSnap.data().completed === true;
    }

    return {
        exercises: selectedExercises,
        planName: planName,
        date: date,
        isCompleted: isCompleted
    };
}

export async function completeWorkout(date) {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;

    const completionRef = doc(db, 'users', userId, 'workoutCompletion', date);
    await setDoc(completionRef, {
        completed: true,
        completedAt: new Date().toISOString(),
        date: date
    });
    return true;
}

export async function isWorkoutCompleted(date) {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;

    const completionRef = doc(db, 'users', userId, 'workoutCompletion', date);
    const completionSnap = await getDoc(completionRef);
    return completionSnap.exists() && completionSnap.data().completed === true;
}
export async function getCompletedWorkoutDates() {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];

    const completionsRef = collection(db, 'users', userId, 'workoutCompletion');
    const querySnapshot = await getDocs(completionsRef);
    const completedDates = [];
    querySnapshot.forEach(doc => {
        if (doc.data().completed === true) {
            completedDates.push(doc.id);
        }
    });
    console.log('Completed dates:', completedDates);
    return completedDates;
}