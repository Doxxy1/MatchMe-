const Job = require('./../model/job.js');
const mongoose = require('mongoose');

const validJobData = {
    name: "testJob",
    company: null,
    education: null,
    competence:  null,
    location:  "test location",
    typeofwork:  1,
    description: "test description",
    salary:  1
};

beforeAll(async () => {
    const url = `mongodb+srv://matchme:S1eDmHKdzWnGLR02@matchmemongo-f5qtv.mongodb.net/testmatchmedb?retryWrites=true&w=majority`;
    await mongoose.connect(url, { useNewUrlParser: true })
});


it('Should save job to database', async done => {
    const job = new Job(validJobData);
    const savedJob = await job.save();

    expect(savedJob.name).toBe(validJobData.name);
    expect(savedJob.company).toBe(validJobData.company);
    expect(savedJob.education).toBe(validJobData.education);
    expect(savedJob.competence).toBe(validJobData.competence);
    expect(savedJob.location).toBe(validJobData.location);
    expect(savedJob.typeofwork).toBe(validJobData.typeofwork);
    expect(savedJob.description).toBe(validJobData.description);
    expect(savedJob.salary).toBe(validJobData.salary);

    done();
});

afterAll(async () => {
    await Job.deleteMany();
    await mongoose.connection.close();
});


