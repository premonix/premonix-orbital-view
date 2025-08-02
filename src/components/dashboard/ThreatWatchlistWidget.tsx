import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Eye, 
  Clock,
  Globe,
  Plus,
  Trash2
} from "lucide-react";

interface ThreatWatchlistWidgetProps {
  userId: string;
  threatSignals: any[];
}

export const ThreatWatchlistWidget = ({ userId, threatSignals }: ThreatWatchlistWidgetProps) => {
  const { toast } = useToast();
  const [watchlistItems, setWatchlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    custom_title: '',
    custom_description: '',
    priority: 'medium',
    tags: '',
    notes: ''
  });

  useEffect(() => {
    fetchWatchlistItems();
  }, [userId]);

  const fetchWatchlistItems = async () => {
    try {
      const { data, error } = await supabase
        .from('threat_watchlist')
        .select(`
          *,
          threat_signals (
            title,
            category,
            severity,
            country
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching watchlist:', error);
        toast({
          title: "Error loading watchlist",
          description: "Failed to load watchlist items",
          variant: "destructive",
        });
      } else {
        setWatchlistItems(data || []);
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      const { error } = await supabase
        .from('threat_watchlist')
        .insert({
          user_id: userId,
          custom_title: newItem.custom_title,
          custom_description: newItem.custom_description,
          priority: newItem.priority,
          tags: newItem.tags ? newItem.tags.split(',').map(t => t.trim()) : [],
          notes: newItem.notes
        });

      if (error) {
        console.error('Error adding watchlist item:', error);
        toast({
          title: "Error adding item",
          description: "Failed to add item to watchlist",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Item added",
          description: "Successfully added to your watchlist",
        });
        setShowAddModal(false);
        setNewItem({
          custom_title: '',
          custom_description: '',
          priority: 'medium',
          tags: '',
          notes: ''
        });
        fetchWatchlistItems();
      }
    } catch (error) {
      console.error('Error adding watchlist item:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('threat_watchlist')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error('Error removing watchlist item:', error);
        toast({
          title: "Error removing item",
          description: "Failed to remove item from watchlist",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Item removed",
          description: "Successfully removed from your watchlist",
        });
        fetchWatchlistItems();
      }
    } catch (error) {
      console.error('Error removing watchlist item:', error);
    }
  };

  const getSeverityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive';
      case 'medium':
        return 'bg-amber-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-primary" />
              <span>Threat Watchlist</span>
            </CardTitle>
            <CardDescription>
              Monitor specific threats and concerns
            </CardDescription>
          </div>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background border-border">
              <DialogHeader>
                <DialogTitle>Add to Watchlist</DialogTitle>
                <DialogDescription>
                  Add a custom threat or concern to monitor
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newItem.custom_title}
                    onChange={(e) => setNewItem({ ...newItem, custom_title: e.target.value })}
                    placeholder="Enter threat title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newItem.custom_description}
                    onChange={(e) => setNewItem({ ...newItem, custom_description: e.target.value })}
                    placeholder="Describe the threat or concern"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newItem.priority} onValueChange={(value) => setNewItem({ ...newItem, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newItem.tags}
                    onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
                    placeholder="cyber, finance, critical"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newItem.notes}
                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                    placeholder="Additional notes or monitoring instructions"
                    rows={2}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddItem} disabled={!newItem.custom_title}>
                    Add to Watchlist
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading watchlist...</p>
          </div>
        ) : watchlistItems.length === 0 ? (
          <div className="text-center py-6">
            <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No watchlist items</h3>
            <p className="text-muted-foreground mb-4">Add threats or concerns to monitor</p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Item
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {watchlistItems.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium">
                        {item.custom_title || item.threat_signals?.title || 'Custom Item'}
                      </h4>
                      <Badge className={getSeverityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.custom_description || item.threat_signals?.category}
                    </p>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.tags.map((tag: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      {item.threat_signals?.country && (
                        <span className="flex items-center">
                          <Globe className="w-3 h-3 mr-1" />
                          {item.threat_signals.country}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveItem(item.id)}
                    className="ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};