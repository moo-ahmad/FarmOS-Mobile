import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';

import {
  Button,
  Divider,
  Rule,
  Screen,
  SelectorRow,
  Text,
  TextField,
} from '@/components/ui';
import { colors } from '@/theme';

import { loginSchema, type LoginValues } from '../schema';

export interface LoginScreenProps {
  onSubmit: (values: LoginValues) => void;
  submitting?: boolean;
  errorMessage?: string;
  onForgotPassword?: () => void;
  onWorkerPin?: () => void;
}

export function LoginScreen({
  onSubmit,
  submitting = false,
  errorMessage,
  onForgotPassword,
  onWorkerPin,
}: LoginScreenProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '' },
  });

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-4 pb-4 pt-10">
          {/* Brand block */}
          <View className="gap-3 pb-6">
            <View className="flex-row items-center gap-3">
              <View className="h-[26px] w-[26px] bg-accent" />
              <Text className="font-archivo-bold text-[30px] leading-none tracking-tight">
                FarmOS
              </Text>
            </View>
            <View className="h-[3px] w-16 bg-accent" />
            <Text
              variant="body"
              tone="muted"
              className="max-w-[250px] leading-snug"
            >
              {t('login.tagline')}
            </Text>
          </View>
          <Rule />

          {/* Credentials */}
          <View className="gap-4 pt-6">
            <Controller
              control={control}
              name="identifier"
              render={({ field }) => (
                <TextField
                  label={t('login.identifier')}
                  placeholder="jamil@greenfield.farm"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={
                    errors.identifier
                      ? t(errors.identifier.message ?? '')
                      : undefined
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <TextField
                  label={t('login.password')}
                  secureTextEntry={!showPassword}
                  value={field.value}
                  onChangeText={field.onChange}
                  error={
                    errors.password
                      ? t(errors.password.message ?? '')
                      : undefined
                  }
                  trailing={
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={t('login.togglePassword')}
                      hitSlop={8}
                      onPress={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff size={20} color={colors.neutral[500]} />
                      ) : (
                        <Eye size={20} color={colors.neutral[500]} />
                      )}
                    </Pressable>
                  }
                />
              )}
            />
            <Pressable
              accessibilityRole="button"
              className="self-end"
              onPress={onForgotPassword}
            >
              <Text tone="accent" className="font-archivo-bold text-[12px]">
                {t('login.forgotPassword')}
              </Text>
            </Pressable>

            {errorMessage ? (
              <Text variant="caption" tone="accent">
                {errorMessage}
              </Text>
            ) : null}

            <Button
              title={t('login.signIn')}
              loading={submitting}
              onPress={handleSubmit(onSubmit)}
            />
          </View>

          {/* Spacer pushes the worker entry to the bottom of the scroll body */}
          <View className="flex-1" />

          {/* Field-worker entry */}
          <View className="flex-row items-center gap-3 py-6">
            <Divider className="flex-1" />
            <Text variant="micro" tone="muted">
              {t('login.fieldWorker')}
            </Text>
            <Divider className="flex-1" />
          </View>
          <SelectorRow
            badge={<Lock size={20} color={colors.ink} />}
            title={t('login.pinTitle')}
            sub={t('login.pinSub')}
            onPress={onWorkerPin}
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="border-t-total border-ink px-4 py-3">
        <Text variant="caption" tone="muted" className="text-center">
          {t('login.footer')}
        </Text>
      </View>
    </Screen>
  );
}
