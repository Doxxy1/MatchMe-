const User = require('./../model/user.js');
const mongoose = require('mongoose');

const validUserData = {
    email: "test33@email.com",
    password: "test11",
    company: null,
    jobSeeker: null,
    isCompany: false,
    isAdmin: false,
    profilePictureUrl: "test"


};

beforeAll(async () => {
    const url = `mongodb+srv://matchme:S1eDmHKdzWnGLR02@matchmemongo-f5qtv.mongodb.net/testmatchmedb?retryWrites=true&w=majority`;
    await mongoose.connect(url, { useNewUrlParser: true })
});


it('Should save user to database', async done => {

    const user = new User(validUserData);

    const savedUser = await user.save();

    expect(savedUser.email).toBe(validUserData.email);
    expect(savedUser.password).toBe(validUserData.password);
    expect(savedUser.company).toBe(validUserData.company);
    expect(savedUser.jobSeeker).toBe(validUserData.jobSeeker);
    expect(savedUser.isCompany).toBe(validUserData.isCompany);
    expect(savedUser.isAdmin).toBe(validUserData.isAdmin);
    expect(savedUser.profilePictureUrl).toBe(validUserData.profilePictureUrl);

    done();
});

afterAll(async () => {
    await User.deleteMany();
    await mongoose.connection.close();
});


