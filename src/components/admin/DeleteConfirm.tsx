import { AlertTriangle } from 'lucide-react';
import { AdminButton } from './ui/AdminButton';

export function DeleteConfirm({
  title,
  message,
  onConfirm,
  onCancel,
  loading,
}: {
  title: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-sm p-8 rounded-2xl bg-[#0F0F1A] border border-white/10 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto border border-red-500/20">
          <AlertTriangle size={30} className="text-red-500" />
        </div>
        <div>
          <h3 className="text-white font-body font-bold text-lg mb-2">Bạn có chắc chắn?</h3>
          <p className="text-white/40 text-[0.8rem] font-vietnam leading-relaxed">
            {message || (
              <>Hành động này sẽ xóa vĩnh viễn <span className="text-white font-bold">"{title}"</span>. Không thể hoàn tác dữ liệu này.</>
            )}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <AdminButton 
            variant="danger" 
            loading={loading} 
            loadingText="Đang xóa vĩnh viễn..."
            onClick={onConfirm} 
            style={{ width: '100%', padding: '0.8rem' }}
          >
            XÁC NHẬN XÓA
          </AdminButton>
          <AdminButton variant="secondary" onClick={onCancel} style={{ width: '100%', padding: '0.8rem' }}>
            HỦY BỎ
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
