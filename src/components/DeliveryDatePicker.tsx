import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DeliveryDatePickerProps {
  selectedDate: Date | null;
  selectedTime: string;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
}

export default function DeliveryDatePicker({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect
}: DeliveryDatePickerProps) {
  const { t } = useTranslation();
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  // Générer les dates disponibles (7 jours minimum à l'avance, seulement vendredi/samedi/dimanche)
  useEffect(() => {
    const dates: Date[] = [];
    const today = new Date();

    // Commencer 7 jours à partir d'aujourd'hui
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 7);

    // Générer les 12 prochaines semaines de dates de livraison
    for (let i = 0; i < 84; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      // Seulement vendredi (5), samedi (6), dimanche (0)
      if (date.getDay() === 5 || date.getDay() === 6 || date.getDay() === 0) {
        dates.push(new Date(date));
      }
    }

    setAvailableDates(dates);
  }, []);

  const timeSlots = [
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDayName = (date: Date) => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[date.getDay()];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card variant="glass" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-fire" />
          <h3 className="font-display font-bold text-xl">
            Choisir votre date de livraison
          </h3>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                Livraison uniquement le vendredi, samedi et dimanche
              </p>
              <p className="text-amber-700 dark:text-amber-300">
                Les commandes doivent être passées au minimum 7 jours à l'avance.
                Le paiement sera demandé immédiatement après validation de la commande.
              </p>
            </div>
          </div>
        </div>

        {/* Sélection de la date */}
        <div className="mb-6">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date de livraison
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
            {availableDates.slice(0, 21).map((date) => (
              <Button
                key={date.toISOString()}
                variant={selectedDate?.toDateString() === date.toDateString() ? "hero" : "outline"}
                className="h-auto p-3 flex flex-col items-start"
                onClick={() => onDateSelect(date)}
              >
                <span className="font-medium text-sm">
                  {getDayName(date)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {date.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Sélection de l'heure */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t pt-6"
          >
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Heure de livraison souhaitée
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "hero" : "outline"}
                  size="sm"
                  onClick={() => onTimeSelect(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Résumé de la sélection */}
        {selectedDate && selectedTime && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20"
          >
            <h4 className="font-medium mb-2">📅 Livraison prévue</h4>
            <p className="text-sm">
              <strong>{formatDate(selectedDate)}</strong> à <strong>{selectedTime}</strong>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Le paiement sera demandé après validation de cette commande.
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}