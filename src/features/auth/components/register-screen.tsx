import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';

import {
  Button,
  Screen,
  SegmentedControl,
  Text,
  TextField,
} from '@/components/ui';
import { colors } from '@/theme';

import {
  joinFarmSchema,
  registerSchema,
  type JoinFarmValues,
  type RegisterMode,
  type RegisterValues,
} from '../schema';

export interface RegisterScreenProps {
  onCreateFarm: (values: RegisterValues) => void;
  onAddFarm: (values: JoinFarmValues) => void;
  submitting?: boolean;
  errorMessage?: string;
  onBack?: () => void;
  onForgotPassword?: () => void;
}

const MODE_OPTIONS: { value: RegisterMode; label: string }[] = [
  { value: 'new', label: 'register.modeNew' },
  { value: 'existing', label: 'register.modeExisting' },
];

export function RegisterScreen({
  onCreateFarm,
  onAddFarm,
  submitting = false,
  errorMessage,
  onBack,
  onForgotPassword,
}: RegisterScreenProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<RegisterMode>('new');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showExistingPassword, setShowExistingPassword] = useState(false);

  const newForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      farmName: '',
      ownerName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const existingForm = useForm<JoinFarmValues>({
    resolver: zodResolver(joinFarmSchema),
    defaultValues: { email: '', password: '', farmName: '' },
  });

  return (
    <Screen>
      <View className="flex-row items-center gap-3 border-b-rule border-ink bg-neutral-0 px-4 py-3">
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.back')}
            hitSlop={8}
            onPress={onBack}
          >
            <ChevronLeft size={26} color={colors.ink} />
          </Pressable>
        ) : null}
        <Text variant="heading">{t('register.title')}</Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-4 px-4 py-4">
          <SegmentedControl
            options={MODE_OPTIONS.map((option) => ({
              value: option.value,
              label: t(option.label),
            }))}
            value={mode}
            onChange={setMode}
          />

          {mode === 'new' ? (
            <View className="gap-4">
              <Controller
                control={newForm.control}
                name="farmName"
                render={({ field }) => (
                  <TextField
                    label={t('register.farmName')}
                    value={field.value}
                    onChangeText={field.onChange}
                    error={
                      newForm.formState.errors.farmName
                        ? t(newForm.formState.errors.farmName.message ?? '')
                        : undefined
                    }
                  />
                )}
              />
              <Controller
                control={newForm.control}
                name="ownerName"
                render={({ field }) => (
                  <TextField
                    label={t('register.ownerName')}
                    value={field.value}
                    onChangeText={field.onChange}
                    error={
                      newForm.formState.errors.ownerName
                        ? t(newForm.formState.errors.ownerName.message ?? '')
                        : undefined
                    }
                  />
                )}
              />
              <Controller
                control={newForm.control}
                name="email"
                render={({ field }) => (
                  <TextField
                    label={t('register.email')}
                    placeholder="jamil@greenfield.farm"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={
                      newForm.formState.errors.email
                        ? t(newForm.formState.errors.email.message ?? '')
                        : undefined
                    }
                  />
                )}
              />
              <View className="gap-1.5">
                <Controller
                  control={newForm.control}
                  name="password"
                  render={({ field }) => (
                    <TextField
                      label={t('register.password')}
                      secureTextEntry={!showPassword}
                      value={field.value}
                      onChangeText={field.onChange}
                      error={
                        newForm.formState.errors.password
                          ? t(newForm.formState.errors.password.message ?? '')
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
              </View>
              <Controller
                control={newForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <TextField
                    label={t('register.confirmPassword')}
                    secureTextEntry={!showConfirmPassword}
                    value={field.value}
                    onChangeText={field.onChange}
                    error={
                      newForm.formState.errors.confirmPassword
                        ? t(
                            newForm.formState.errors.confirmPassword.message ??
                              '',
                          )
                        : undefined
                    }
                    trailing={
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={t('login.togglePassword')}
                        hitSlop={8}
                        onPress={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} color={colors.neutral[500]} />
                        ) : (
                          <Eye size={20} color={colors.neutral[500]} />
                        )}
                      </Pressable>
                    }
                  />
                )}
              />
            </View>
          ) : (
            <View className="gap-4">
              <Text variant="caption" tone="muted" className="leading-snug">
                {t('register.existingHelper')}
              </Text>
              <Controller
                control={existingForm.control}
                name="email"
                render={({ field }) => (
                  <TextField
                    label={t('register.email')}
                    placeholder="jamil@greenfield.farm"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={
                      existingForm.formState.errors.email
                        ? t(existingForm.formState.errors.email.message ?? '')
                        : undefined
                    }
                  />
                )}
              />
              <View className="gap-1.5">
                <Controller
                  control={existingForm.control}
                  name="password"
                  render={({ field }) => (
                    <TextField
                      label={t('register.password')}
                      secureTextEntry={!showExistingPassword}
                      value={field.value}
                      onChangeText={field.onChange}
                      error={
                        existingForm.formState.errors.password
                          ? t(
                              existingForm.formState.errors.password.message ??
                                '',
                            )
                          : undefined
                      }
                      trailing={
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={t('login.togglePassword')}
                          hitSlop={8}
                          onPress={() =>
                            setShowExistingPassword((prev) => !prev)
                          }
                        >
                          {showExistingPassword ? (
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
              </View>
              <Controller
                control={existingForm.control}
                name="farmName"
                render={({ field }) => (
                  <TextField
                    label={t('register.farmName')}
                    value={field.value}
                    onChangeText={field.onChange}
                    error={
                      existingForm.formState.errors.farmName
                        ? t(
                            existingForm.formState.errors.farmName.message ??
                              '',
                          )
                        : undefined
                    }
                  />
                )}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <View className="border-t-rule border-ink px-4 py-3">
        {errorMessage ? (
          <Text variant="caption" tone="accent" className="pb-3">
            {errorMessage}
          </Text>
        ) : null}
        {mode === 'new' ? (
          <Button
            title={t('register.submit')}
            loading={submitting}
            onPress={() => void newForm.handleSubmit(onCreateFarm)()}
          />
        ) : (
          <Button
            title={t('register.submitExisting')}
            loading={submitting}
            onPress={() => void existingForm.handleSubmit(onAddFarm)()}
          />
        )}
      </View>
    </Screen>
  );
}
