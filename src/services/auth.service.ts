import * as AWS from "aws-sdk";

const cognito = new AWS.CognitoIdentityServiceProvider();

function isOffline() { 
  return process.env.IS_OFFLINE === "true" || process.env.NODE_ENV === "development";
}

export async function signUp(userPoolClientId: string, email: string, password: string) {
  if (isOffline()) {
    // Mocked signup response
    console.log("[MOCK] SignUp called locally");
    return { email, message: "Signed up (mock)" };
  }

  await cognito
    .signUp({
      ClientId: userPoolClientId,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: "email", Value: email }],
    })
    .promise();

  return { email };
}

export async function signIn(userPoolClientId: string, email: string, password: string) {
  if (isOffline()) {
    console.log("[MOCK] SignIn called locally");
    return {
      AccessToken: "dummy-access-token",
      IdToken: "dummy-id-token",
      RefreshToken: "dummy-refresh-token",
    };
  }

  const resp = await cognito
    .initiateAuth({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: userPoolClientId,
      AuthParameters: { USERNAME: email, PASSWORD: password },
    })
    .promise();

  return resp.AuthenticationResult;
}

export async function signOut(accessToken: string) {
  if (isOffline()) {
    console.log("[MOCK] SignOut called locally");
    return true;
  }

  await cognito.globalSignOut({ AccessToken: accessToken }).promise();
  return true;
}
