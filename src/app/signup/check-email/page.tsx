export default function CheckEmailPage() {
  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="pixel-card w-full max-w-sm p-6 text-center">
        <h1 className="text-lg mb-4">📬 메일을 확인해주세요!</h1>
        <p className="text-xs leading-relaxed">
          가입하신 이메일로 인증 링크를 보냈어요.
          <br />
          메일함에서 링크를 눌러 인증을 완료해주세요.
        </p>
      </div>
    </div>
  );
}
