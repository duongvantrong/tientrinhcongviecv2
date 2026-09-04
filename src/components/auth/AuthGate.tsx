import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  loginWithGoogle,
  logoutUser,
  checkUserAuthorization,
  AuthAccessCheck,
  SUPER_ADMIN_EMAIL,
} from '../../lib/firebase';
import { Shield, Lock, AlertTriangle, LogOut, CheckCircle, RefreshCw, Copy, Check } from 'lucide-react';
import { WhitelistManagementModal } from './WhitelistManagementModal';

interface AuthContextType {
  user: User | null;
  authAccess: AuthAccessCheck | null;
  isSuperAdmin: boolean;
  logout: () => Promise<void>;
  openWhitelistModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  authAccess: null,
  isSuperAdmin: false,
  logout: async () => {},
  openWhitelistModal: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authAccess, setAuthAccess] = useState<AuthAccessCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isWhitelistOpen, setIsWhitelistOpen] = useState(false);
  const [copiedRequest, setCopiedRequest] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const access = await checkUserAuthorization(currentUser);
          setAuthAccess(access);
        } catch (e) {
          console.error('Error verifying auth access:', e);
          setAuthAccess({
            isAllowed: false,
            isSuperAdmin: false,
            role: 'unauthorized',
            reason: 'Lỗi xác thực quyền truy cập.',
          });
        }
      } else {
        setAuthAccess(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const loggedUser = await loginWithGoogle();
      const access = await checkUserAuthorization(loggedUser);
      setAuthAccess(access);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setLoginError('Đăng nhập thất bại: ' + (err?.message || 'Vui lòng kiểm tra lại kết nối mạng'));
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setAuthAccess(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleCopyRequestMessage = () => {
    if (!user?.email) return;
    const msg = `Kính gửi Quản trị viên, tôi là giáo viên muốn truy cập Hệ thống Quản lý Kế hoạch Dạy học & Hồ sơ GVCN. Vui lòng cấp quyền cho tài khoản Gmail của tôi: ${user.email}. Trân trọng cảm ơn!`;
    navigator.clipboard.writeText(msg);
    setCopiedRequest(true);
    setTimeout(() => setCopiedRequest(false), 3000);
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 flex flex-col items-center max-w-sm w-full text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4">
            <RefreshCw className="w-6 h-6 text-emerald-700 animate-spin" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Đang xác thực hệ thống...</h3>
          <p className="text-xs text-slate-500">Kiểm tra phiên đăng nhập và quyền truy cập bảo mật</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State (Not logged in)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex flex-col items-center justify-center p-4 text-slate-100">
        <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-100/20 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 border border-white/20 shadow-inner mb-3">
              <Shield className="w-7 h-7 text-emerald-300" />
            </div>
            <h2 className="text-xl font-black tracking-tight">Hệ Thống Giáo Viên THCS</h2>
            <p className="text-xs text-emerald-100 mt-1 font-medium">
              Quản lý Kế hoạch bài dạy • Ma trận đề • Hồ sơ GVCN chuẩn TT22
            </p>
          </div>

          {/* Body */}
          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Bảo mật & Phân quyền Gmail</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Chỉ các tài khoản Gmail được Quản trị viên phê duyệt mới có quyền đăng nhập và sử dụng.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <RefreshCw className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Đồng bộ Cloud đa thiết bị</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Dữ liệu học sinh, nhận xét học bạ tự động lưu và đồng bộ tức thì trên máy tính, laptop và điện thoại.
                  </p>
                </div>
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Google Sign-in Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-slate-400 text-slate-800 font-bold rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 active:scale-[0.99] cursor-pointer"
            >
              {/* Official Google 'G' logo SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-sm">
                {isLoggingIn ? 'Đang kết nối Google...' : 'Đăng nhập với Google / Gmail'}
              </span>
            </button>

            <div className="text-center">
              <span className="text-[11px] text-slate-400">
                Quản trị viên phụ trách: <strong>{SUPER_ADMIN_EMAIL}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated but Unauthorized (Email not in Whitelist)
  if (user && authAccess && !authAccess.isAllowed) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="bg-rose-600 text-white p-6 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-rose-200" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Tài khoản chưa được cấp quyền</h3>
              <p className="text-xs text-rose-100">Cần được Quản trị viên thêm vào danh sách sử dụng</p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Account pill */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center font-bold text-slate-700">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="overflow-hidden">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Tài khoản hiện tại
                </span>
                <span className="text-sm font-bold text-slate-900 truncate block">{user.email}</span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-600">
              Tài khoản Gmail của Thầy/Cô chưa nằm trong danh sách được phép sử dụng hệ thống này.
              Vui lòng liên hệ Quản trị viên trưởng <strong>{SUPER_ADMIN_EMAIL}</strong> để được cấp quyền truy cập.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={handleCopyRequestMessage}
                className="flex-1 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedRequest ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                <span>{copiedRequest ? 'Đã sao chép tin nhắn!' : 'Sao chép tin nhắn xin cấp quyền'}</span>
              </button>

              <button
                onClick={handleLogout}
                className="py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Đổi tài khoản khác</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized State -> Render full application!
  const isSuperAdmin =
    user?.email?.toLowerCase().trim() === SUPER_ADMIN_EMAIL.toLowerCase().trim() ||
    authAccess?.isSuperAdmin === true;

  return (
    <AuthContext.Provider
      value={{
        user,
        authAccess,
        isSuperAdmin,
        logout: handleLogout,
        openWhitelistModal: () => setIsWhitelistOpen(true),
      }}
    >
      {children}

      {/* Whitelist Manager Modal for Admin */}
      <WhitelistManagementModal
        isOpen={isWhitelistOpen}
        onClose={() => setIsWhitelistOpen(false)}
        currentUser={user}
      />
    </AuthContext.Provider>
  );
};
