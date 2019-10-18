const JobSeeker = require('./../model/jobSeeker.js');
const mongoose = require('mongoose');

const validJobSeekerData = {
    name: "test",
    phone: "test phone",
    education: null,
    competence: null,
    location: "test location",
    typeofwork: 1,
    salary: 1,
    education_p: 0.2,
    competence_p: 0.2,
    location_p: 0.2,
    typeofwork_p: 0.2,
    salary_p: 0.2,
    completeJobMatch: null
}

beforeAll(async () => {
    const url = `mongodb+srv://matchme:S1eDmHKdzWnGLR02@matchmemongo-f5qtv.mongodb.net/testmatchmedb?retryWrites=true&w=majority`;
    await mongoose.connect(url, { useNewUrlParser: true })
});


it('Should save jobSeeker to database', async done => {
    const jobSeeker = new JobSeeker(validJobSeekerData);

    const savedJobSeeker = await jobSeeker.save();

    expect(savedJobSeeker.name).toBe(validJobSeekerData.name);
    expect(savedJobSeeker.phone).toBe(validJobSeekerData.phone);
    expect(savedJobSeeker.education).toBe(validJobSeekerData.education);
    expect(savedJobSeeker.competence).toBe(validJobSeekerData.competence);
    expect(savedJobSeeker.location).toBe(validJobSeekerData.location);
    expect(savedJobSeeker.typeofwork).toBe(validJobSeekerData.typeofwork);
    expect(savedJobSeeker.salary).toBe(validJobSeekerData.salary);
    expect(savedJobSeeker.education_p).toBe(validJobSeekerData.education_p);
    expect(savedJobSeeker.competence_p).toBe(validJobSeekerData.competence_p);
    expect(savedJobSeeker.location_p).toBe(validJobSeekerData.location_p);
    expect(savedJobSeeker.typeofwork_p).toBe(validJobSeekerData.typeofwork_p);
    expect(savedJobSeeker.salary_p).toBe(validJobSeekerData.salary_p);
    expect(savedJobSeeker.completeJobMatch).toBe(validJobSeekerData.completeJobMatch);



    done();
});

afterAll(async () => {
    await JobSeeker.deleteMany();
    await mongoose.connection.close();
});


