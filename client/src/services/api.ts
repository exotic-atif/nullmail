import type { SendEmailPayload, ApiResponse } from '@/types';
import { supabase } from '@/lib/supabase';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
  async sendEmail(
    payload: SendEmailPayload,
    attachments?: File[]
  ): Promise<ApiResponse> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const formData = new FormData();
      formData.append('data', JSON.stringify(payload));

      if (attachments) {
        attachments.forEach((file) => {
          formData.append('attachments', file);
        });
      }

      const response = await fetch(`${BASE_URL}/email/send`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `Server error: ${response.status}`,
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Network error. Please check your connection.',
      };
    }
  },

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },
};
