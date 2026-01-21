const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./src/models/Movie');
const Theatre = require('./src/models/Theatre');
const Showtime = require('./src/models/Showtime');
const User = require('./src/models/User');
const { getPosterUrl } = require('./src/services/tmdbService');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const seedData = async () => {
    try {

        await Movie.deleteMany();
        await Theatre.deleteMany();
        await Showtime.deleteMany();
        await User.deleteMany();

        console.log('Clearing database and starting seed...');

        const users = [
            {
                name: 'Admin User',
                email: 'adminmanager@gmail.com',
                password: 'admin123',
                isAdmin: true
            },
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                isAdmin: false
            }
        ];

        for (const user of users) {
            await User.create(user);
        }
        const movieData = [
            // English
            {
                title: "Inception",
                language: "English",
                genre: ["Sci-Fi", "Action"],
                duration: 148,
                releaseDate: new Date("2010-07-16"),
                description: "A thief who steals corporate secrets through the use of dream-sharing technology.",
                trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
                director: "Christopher Nolan"
            },
            {
                title: "Interstellar",
                language: "English",
                genre: ["Sci-Fi", "Drama"],
                duration: 169,
                releaseDate: new Date("2014-11-05"),
                description: "A team of astronauts travel through a wormhole in search of a new home for humanity.",
                trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
                director: "Christopher Nolan"
            },
            { title: "Avengers: Endgame", language: "English", genre: ["Action", "Adventure"], duration: 181, releaseDate: new Date("2019-04-26"), description: "The Avengers assemble once more in order to restore balance to the universe.", trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGZo1E" },
            { title: "Oppenheimer", language: "English", genre: ["Biography", "Drama"], duration: 180, releaseDate: new Date("2023-07-21"), description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.", trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg" },
            { title: "The Dark Knight", language: "English", genre: ["Action", "Crime"], duration: 152, releaseDate: new Date("2008-07-18"), description: "Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY" },
            // Tamil
            {
                title: "Leo",
                language: "Tamil",
                genre: ["Action", "Thriller"],
                duration: 164,
                releaseDate: new Date("2023-10-19"),
                description: "A mild-mannered cafe owner becomes a local hero, but old secrets catch up with him.",
                trailerUrl: "https://www.youtube.com/watch?v=Po3jVh5iW08"
            },
            { title: "Vikram", language: "Tamil", genre: ["Action", "Thriller"], duration: 175, releaseDate: new Date("2022-06-03"), description: "A special agent investigates a series of murders committed by a masked group.", trailerUrl: "https://www.youtube.com/watch?v=OKBMCL-umJI" },
            { title: "Jailer", language: "Tamil", genre: ["Action", "Comedy"], duration: 168, releaseDate: new Date("2023-08-10"), description: "A retired jailer goes on a quest to save his son from a powerful gangster.", trailerUrl: "https://www.youtube.com/watch?v=xerV1ihS-rY" },
            { title: "Master", language: "Tamil", genre: ["Action", "Thriller"], duration: 179, releaseDate: new Date("2021-01-13"), description: "An alcoholic professor is sent to a juvenile school, where he clashes with a ruthless gangster.", trailerUrl: "https://www.youtube.com/watch?v=UTiXQcrLlv4" },
            { title: "Kaithi", language: "Tamil", genre: ["Action", "Thriller"], duration: 147, releaseDate: new Date("2019-10-25"), description: "A paroled convict must race against time to save poisoned police officers.", trailerUrl: "https://www.youtube.com/watch?v=gTIn6-HIdF8" },
            { title: "KGF: Chapter 2", language: "Tamil", genre: ["Action", "Drama"], duration: 168, releaseDate: new Date("2022-04-14"), description: "The blood-soaked land of Kolar Gold Fields has a new overlord now - Rocky.", trailerUrl: "https://www.youtube.com/watch?v=JKa05nyU8Qo" },

            // Telugu
            { title: "RRR", language: "Telugu", genre: ["Action", "Drama"], duration: 187, releaseDate: new Date("2022-03-25"), description: "A fictional history of two legendary revolutionaries and their journey away from home.", trailerUrl: "https://www.youtube.com/watch?v=NgBoMJy386M" },
            { title: "Baahubali: The Beginning", language: "Telugu", genre: ["Action", "Drama"], duration: 158, releaseDate: new Date("2015-07-10"), description: "A child from the Mahishmati kingdom is raised by tribal people and eventually learns about his royal heritage.", trailerUrl: "https://www.youtube.com/watch?v=sOEg_YZQsTI" },
            { title: "Baahubali: The Conclusion", language: "Telugu", genre: ["Action", "Drama"], duration: 167, releaseDate: new Date("2017-04-28"), description: "Shiva, the son of Bahubali, learns about his heritage and begins to look for answers.", trailerUrl: "https://www.youtube.com/watch?v=qD-6d8Wo3do" },
            { title: "Pushpa: The Rise", language: "Telugu", genre: ["Action", "Thriller"], duration: 179, releaseDate: new Date("2021-12-17"), description: "A laborer rises through the ranks of a red sandalwood smuggling syndicate.", trailerUrl: "https://www.youtube.com/watch?v=pKctjlRbBWw" },
            { title: "Salaar", language: "Telugu", genre: ["Action", "Thriller"], duration: 175, releaseDate: new Date("2023-12-22"), description: "A gang leader makes a promise to a dying friend and takes on other criminal gangs.", trailerUrl: "https://www.youtube.com/watch?v=H7mPlid2QhY" },
            // Hindi
            { title: "Pathaan", language: "Hindi", genre: ["Action", "Thriller"], duration: 146, releaseDate: new Date("2023-01-25"), description: "An exiled RAW agent must work with an ISI agent to stop a former RAW agent who has gone rogue.", trailerUrl: "https://www.youtube.com/watch?v=vqu4z34wENw" },
            { title: "Jawan", language: "Hindi", genre: ["Action", "Thriller"], duration: 169, releaseDate: new Date("2023-09-07"), description: "A man is driven by a personal vendetta to rectify the wrongs in society.", trailerUrl: "https://www.youtube.com/watch?v=MWOlnZjkX9U" },
            { title: "3 Idiots", language: "Hindi", genre: ["Comedy", "Drama"], duration: 170, releaseDate: new Date("2009-12-25"), description: "Two friends search for their long-lost companion and reflect on their college days.", trailerUrl: "https://www.youtube.com/watch?v=K0eDlFX9GMc" },
            { title: "Dangal", language: "Hindi", genre: ["Biography", "Sport"], duration: 161, releaseDate: new Date("2016-12-23"), description: "A former wrestler trains his daughters to become world-class wrestlers.", trailerUrl: "https://www.youtube.com/watch?v=x_7YlGv9u1g" },
            { title: "War", language: "Hindi", genre: ["Action", "Thriller"], duration: 154, releaseDate: new Date("2019-10-02"), description: "An Indian soldier is assigned to eliminate his former mentor who has gone rogue.", trailerUrl: "https://www.youtube.com/watch?v=tQ0mzXRk-oM" },
            // Malayalam
            { title: "Drishyam", language: "Malayalam", genre: ["Crime", "Thriller"], duration: 160, releaseDate: new Date("2013-12-19"), description: "A man goes to extreme lengths to save his family from punishment after an accidental crime.", trailerUrl: "https://www.youtube.com/watch?v=8K0m-8Gk0yE" },
            { title: "Premam", language: "Malayalam", genre: ["Romance", "Comedy"], duration: 156, releaseDate: new Date("2015-05-29"), description: "A young man finds love at different stages of his life.", trailerUrl: "https://www.youtube.com/watch?v=0G2VxhV_gXM" },
            { title: "Bangalore Days", language: "Malayalam", genre: ["Comedy", "Drama"], duration: 171, releaseDate: new Date("2014-05-30"), description: "Three cousins move to Bangalore for their own reasons and find their lives intertwined.", trailerUrl: "https://www.youtube.com/watch?v=S-V_S6-X1_w" },
            { title: "Lucifer", language: "Malayalam", genre: ["Action", "Crime"], duration: 175, releaseDate: new Date("2019-03-28"), description: "A political godfather dies, and a mysterious man steps in to take his place.", trailerUrl: "https://www.youtube.com/watch?v=M99C0Rlt0z0" },
            { title: "Manjummel Boys", language: "Malayalam", genre: ["Survival", "Thriller"], duration: 135, releaseDate: new Date("2024-02-22"), description: "A group of friends find themselves in a life-and-death situation.", trailerUrl: "https://www.youtube.com/watch?v=pYofp5I82mI" },
            // Kannada
            { title: "KGF: Chapter 1", language: "Kannada", genre: ["Action", "Drama"], duration: 155, releaseDate: new Date("2018-12-21"), description: "A high-ranking assassin in Mumbai pursues power and wealth.", trailerUrl: "https://www.youtube.com/watch?v=-KfsY-qwoh0" },
            { title: "Charlie 777", language: "Kannada", genre: ["Drama", "Adventure"], duration: 164, releaseDate: new Date("2022-06-10"), description: "A lonely man finds a new purpose in life after adopting a stray dog named Charlie.", trailerUrl: "https://www.youtube.com/watch?v=2r5Z_Yn8Y8c" },
            { title: "Kantara", language: "Kannada", genre: ["Action", "Fantasy"], duration: 148, releaseDate: new Date("2022-09-30"), description: "A conflict between a forest officer and a local man in a coastal village.", trailerUrl: "https://www.youtube.com/watch?v=8K8V6zXh0zE" }
        ];

        console.log('Fetching posters from TMDB...');
        const moviesWithPosters = [];
        for (const m of movieData) {
            const posterUrl = await getPosterUrl(m.title);
            moviesWithPosters.push({ ...m, posterUrl, isActive: true });
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        const movies = await Movie.insertMany(moviesWithPosters);

        const coimbatoreTheatres = [
            { name: "KG Cinemas", address: "Race Course Rd, Gopalapuram" },
            { name: "The Cinema @ Brookefields Mall", address: "Krishnaswamy Rd, Brookefields Mall" },
            { name: "INOX Prozone Mall", address: "Sathy Rd, Prozone Mall" },
            { name: "PVR Fun Republic Mall", address: "Avinashi Rd, Fun Republic Mall" },
            { name: "Karpagam Cinemas", address: "Sathy Rd, Ganapathy" },
            { name: "Sri Sakthi Cinemas", address: "Thadagam Rd, Sri Sakthi Building" },
            { name: "Kovai Shanti Complex", address: "Oppanakara St, Town Hall" },
            { name: "Murugan Cinemas", address: "Sathy Rd, Ganapathy" },
            { name: "Ganga Yamuna Cinemas", address: "Mettupalayam Rd, Near Central Bus Stand" },
            { name: "Carnival Cinemas – Coimbatore", address: "Singanallur, Trichy Rd" }
        ];

        const theatresToInsert = coimbatoreTheatres.map(t => ({
            ...t,
            city: "Coimbatore",
            state: "Tamil Nadu",
            screens: [
                { screenName: "Screen 1", totalSeats: 100, seatLayout: { rows: 10, cols: 10 } },
                { screenName: "Screen 2", totalSeats: 100, seatLayout: { rows: 10, cols: 10 } },
                { screenName: "Screen 3", totalSeats: 100, seatLayout: { rows: 10, cols: 10 } }
            ]
        }));

        const theatres = await Theatre.insertMany(theatresToInsert);

        const showTimings = ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"];
        const showtimes = [];

        movies.forEach((movie, mIndex) => {
            const theatreIndices = [(mIndex % theatres.length), ((mIndex + 5) % theatres.length)];

            theatreIndices.forEach(tIndex => {
                const theatre = theatres[tIndex];
                const screen = theatre.screens[0];

                showTimings.forEach(time => {
                    showtimes.push({
                        movie: movie._id,
                        theatre: theatre._id,
                        screenId: screen.screenName,
                        showDate: new Date(),
                        showTime: time,
                        pricePerSeat: 150 + (mIndex % 5) * 20,
                        bookedSeats: []
                    });
                });
            });
        });

        await Showtime.insertMany(showtimes);

        console.log(`Seeding complete: ${movies.length} movies, ${theatres.length} Coimbatore theatres, and ${showtimes.length} showtimes inserted.`);
        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

connectDB().then(seedData);
